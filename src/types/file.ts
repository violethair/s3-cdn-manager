export interface Folder {
    id: string;
    name: string;
    createdAt: string;
    parentId: string | null;
}

export interface FileItem {
    name: string;
    size: number;
    lastModified: string;
    url: string;
    key: string;
    folderId: string | null;
}

export interface FileListResponse {
    files: FileItem[];
    nextContinuationToken?: string;
    isTruncated: boolean;
}

export interface EditingFile {
    key: string;
    newName: string;
}
