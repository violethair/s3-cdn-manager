import { S3Client, ListObjectsV2Command, DeleteObjectCommand, DeleteObjectsCommand, CopyObjectCommand, PutObjectCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import { FileItem, Folder } from "@/types";
import { PutObjectCommandInput } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Helper function to clean path
function cleanPath(path: string): string {
    // Remove multiple consecutive slashes and trim slashes from start/end
    return path.replace(/\/+/g, "/").replace(/^\/+|\/+$/g, "");
}

export async function listAllFiles(prefix: string): Promise<{ files: FileItem[]; folders: Folder[] }> {
    // Clean and normalize the prefix
    const cleanPrefix = prefix === "/" ? "" : cleanPath(prefix);
    const prefixDepth = cleanPrefix ? cleanPrefix.split("/").length : 0;

    const command = new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: cleanPrefix ? `${cleanPrefix}/` : "",
        Delimiter: "/",
    });

    const response = await s3Client.send(command);

    // Get files from Contents (excluding folders)
    const files =
        response.Contents?.filter((item) => !item.Key?.endsWith("/") && (!cleanPrefix || item.Key?.startsWith(cleanPrefix + "/"))).map((item) => {
            const pathParts = item.Key?.split("/");
            const folderId = pathParts && pathParts.length > 1 ? pathParts.slice(0, -1).join("/") : null;

            return {
                name: pathParts?.pop() || "",
                size: item.Size || 0,
                lastModified: item.LastModified?.toISOString() || new Date().toISOString(),
                url: `${process.env.NEXT_PUBLIC_CDN_URL}/${item.Key}`,
                key: item.Key || "",
                folderId,
            };
        }) || [];

    // Get folders from CommonPrefixes (direct subfolders only)
    const folders = (response.CommonPrefixes || [])
        .map((prefix) => {
            const pathParts = prefix.Prefix?.split("/").filter(Boolean) || [];

            // Only include folders that are direct children of the current prefix
            if (pathParts.length !== prefixDepth + 1) {
                return null;
            }

            return {
                id: prefix.Prefix || "",
                name: pathParts[pathParts.length - 1] || "",
                createdAt: new Date().toISOString(),
                parentId: pathParts.length > 1 ? pathParts.slice(0, -1).join("/") : null,
            };
        })
        .filter((folder): folder is Folder => folder !== null);

    return { files, folders };
}

export async function deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });

    await s3Client.send(command);
}

export async function bulkDeleteFiles(keys: string[]): Promise<void> {
    const command = new DeleteObjectsCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {
            Objects: keys.map((key) => ({ Key: key })),
            Quiet: true,
        },
    });

    await s3Client.send(command);
}

export async function copyFile(sourceKey: string, destinationPath: string): Promise<string> {
    // Get file name from sourceKey
    const fileName = sourceKey.split("/").pop();
    if (!fileName) throw new Error("Invalid source key");

    // Create destinationKey
    const cleanedPath = destinationPath === "/" ? "" : cleanPath(destinationPath);
    const destinationKey = cleanedPath ? `${cleanedPath}/${fileName}` : fileName;

    // Copy file in S3
    await s3Client.send(
        new CopyObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            CopySource: `${process.env.AWS_BUCKET_NAME}/${sourceKey}`,
            Key: destinationKey,
        })
    );

    return destinationKey;
}

export async function renameFile(oldKey: string, newName: string): Promise<FileItem> {
    // Get folder path from old key
    const folderPath = oldKey.split("/").slice(0, -1).join("/");

    // Create new key with the same folder path
    const newKey = folderPath ? `${folderPath}/${newName}` : newName;

    // First copy the file with new name
    await s3Client.send(
        new CopyObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            CopySource: `${process.env.AWS_BUCKET_NAME}/${oldKey}`,
            Key: newKey,
        })
    );

    // Then delete the old file
    await deleteFile(oldKey);

    // Return new file info
    return {
        name: newName,
        key: newKey,
        url: `${process.env.NEXT_PUBLIC_CDN_URL}/${newKey}`,
        size: 0, // Size will be updated when listing files
        lastModified: new Date().toISOString(),
        folderId: folderPath || null,
    };
}

export async function createFolder(name: string): Promise<Folder> {
    const cleanedName = cleanPath(name);
    const folderKey = `${cleanedName}/`;
    const pathParts = cleanedName.split("/").filter(Boolean);

    await s3Client.send(
        new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: folderKey,
            Body: "",
        })
    );

    return {
        id: folderKey,
        name: pathParts[pathParts.length - 1],
        createdAt: new Date().toISOString(),
        parentId: pathParts.length > 1 ? pathParts.slice(0, -1).join("/") : null,
    };
}

export async function deleteFolder(folderId: string): Promise<void> {
    // Clean prefix
    const prefix = cleanPath(folderId);

    // List all files in folder
    const command = new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: prefix,
    });

    const response = await s3Client.send(command);
    const objects = response.Contents || [];

    if (objects.length > 0) {
        // Delete all files in folder
        const deleteCommand = new DeleteObjectsCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {
                Objects: objects.map((obj) => ({ Key: obj.Key! })),
                Quiet: true,
            },
        });

        await s3Client.send(deleteCommand);
    }
}

export async function getStatistics(currentPath: string = "/"): Promise<{ totalFiles: number; totalFolders: number; totalSize: number }> {
    const { files, folders } = await listAllFiles(currentPath);

    return {
        totalFiles: files.length,
        totalFolders: folders.length,
        totalSize: files.reduce((acc, file) => acc + file.size, 0),
    };
}

export async function uploadFile(file: Buffer, filename: string, path: string): Promise<FileItem> {
    // Clean path and create full key
    const cleanedPath = path === "/" ? "" : cleanPath(path);
    const key = cleanedPath ? `${cleanedPath}/${filename}` : filename;

    // Upload to S3
    const params: PutObjectCommandInput = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: getContentType(filename),
    };

    await s3Client.send(new PutObjectCommand(params));

    // Return file info
    return {
        name: filename,
        size: file.length,
        lastModified: new Date().toISOString(),
        url: `${process.env.NEXT_PUBLIC_CDN_URL}/${key}`,
        key: key,
        folderId: cleanedPath || null,
    };
}

// Helper function to determine content type
function getContentType(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase();
    const contentTypes: { [key: string]: string } = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        webp: "image/webp",
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        zip: "application/zip",
        mp4: "video/mp4",
        mp3: "audio/mpeg",
    };

    return contentTypes[ext || ""] || "application/octet-stream";
}

export async function deleteFiles(keys: string[]): Promise<void> {
    if (keys.length === 1) {
        // If only one file, use simple delete
        await deleteFile(keys[0]);
    } else {
        // If multiple files, use bulk delete
        await bulkDeleteFiles(keys);
    }
}

export async function checkHealth(): Promise<boolean> {
    try {
        // Try to list buckets to check connection
        await s3Client.send(new ListBucketsCommand({}));
        return true;
    } catch (error) {
        console.error("S3 connection error:", error);
        return false;
    }
}
