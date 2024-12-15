// API Endpoints
export const API_ENDPOINTS = {
    FILES: {
        LIST: "/api/files",
        UPLOAD: "/api/files/upload",
        DELETE: "/api/files/delete",
        BULK_DELETE: "/api/files/bulk-delete",
        RENAME: "/api/files/rename",
        COPY: "/api/files/copy",
        SEARCH: "/api/files/search",
    },
    FOLDERS: {
        LIST: "/api/folders",
        DELETE: "/api/folders/delete",
    },
    STATISTICS: "/api/statistics",
} as const;

// Query Keys
export const QUERY_KEYS = {
    FILES: "files",
    FOLDERS: "folders",
    STATISTICS: "statistics",
} as const;

// Common Messages
export const MESSAGES = {
    SUCCESS: {
        UPLOAD: "Upload successful",
        DELETE: "File deleted successfully",
        BULK_DELETE: "Files deleted successfully",
        RENAME: "Renamed successfully",
        COPY: "File copied successfully",
        CREATE_FOLDER: "Folder created successfully",
        DELETE_FOLDER: "Folder deleted successfully",
    },
    ERROR: {
        UPLOAD: "Upload failed",
        DELETE: "Failed to delete file",
        BULK_DELETE: "Failed to delete files",
        RENAME: "Failed to rename",
        COPY: "Failed to copy file",
        CREATE_FOLDER: "Failed to create folder",
        DELETE_FOLDER: "Failed to delete folder",
    },
    CONFIRM: {
        DELETE_FILE: (name: string) => `Are you sure you want to delete "${name}"?`,
        DELETE_FOLDER: (name: string) => `Are you sure you want to delete "${name}" folder?`,
        BULK_DELETE: (count: number) => `Are you sure you want to delete ${count} selected files?`,
    },
} as const;
