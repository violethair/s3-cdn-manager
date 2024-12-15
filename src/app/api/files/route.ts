import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const pageSize = 10;
        const continuationToken = searchParams.get("continuationToken");
        const prefix = searchParams.get("prefix") || "";

        // Xử lý prefix
        const cleanPrefix = prefix === "/" ? "" : prefix.startsWith("/") ? prefix.substring(1) : prefix;

        const command = new ListObjectsV2Command({
            Bucket: process.env.AWS_BUCKET_NAME,
            MaxKeys: pageSize,
            ContinuationToken: continuationToken ? decodeURIComponent(continuationToken) : undefined,
            Delimiter: "/",
            Prefix: cleanPrefix,
        });

        const response = await s3Client.send(command);
        const files =
            response.Contents?.filter((item) => !item.Key?.endsWith("/") && item.Key !== cleanPrefix).map((item) => ({
                name: item.Key?.split("/").pop() || "",
                size: item.Size,
                lastModified: item.LastModified,
                url: `https://cdn.mooncook.ai/${item.Key}`,
                key: item.Key || "",
            })) || [];

        return NextResponse.json({
            files,
            nextContinuationToken: response.NextContinuationToken ? encodeURIComponent(response.NextContinuationToken) : undefined,
            isTruncated: response.IsTruncated,
        });
    } catch (error) {
        console.error("Error listing files:", error);
        return NextResponse.json({ message: "Failed to list files" }, { status: 500 });
    }
}
