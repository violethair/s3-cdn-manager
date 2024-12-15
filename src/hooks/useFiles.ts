import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS, QUERY_KEYS, MESSAGES } from "@/constants";
import { FileListResponse } from "@/types";
import { toast } from "sonner";

export const useFiles = (currentToken: string | null, currentPath: string, debouncedQuery: string) => {
    const queryClient = useQueryClient();

    const filesQuery = useQuery<FileListResponse>({
        queryKey: [QUERY_KEYS.FILES, currentToken, currentPath, debouncedQuery],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (currentToken) params.append("continuationToken", currentToken);
            if (currentPath !== "/") params.append("prefix", currentPath);
            if (debouncedQuery) params.append("query", debouncedQuery);

            const url = debouncedQuery ? `${API_ENDPOINTS.FILES.SEARCH}?${params.toString()}` : `${API_ENDPOINTS.FILES.LIST}?${params.toString()}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch files");
            return response.json();
        },
        enabled: !!currentPath,
    });

    const renameMutation = useMutation({
        mutationFn: async ({ oldKey, newName }: { oldKey: string; newName: string }) => {
            const response = await fetch(API_ENDPOINTS.FILES.RENAME, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldKey, newName }),
            });
            if (!response.ok) throw new Error("Failed to rename file");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FILES] });
            toast.success(MESSAGES.SUCCESS.RENAME);
        },
        onError: () => {
            toast.error(MESSAGES.ERROR.RENAME);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (key: string) => {
            const response = await fetch(API_ENDPOINTS.FILES.DELETE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key }),
            });
            if (!response.ok) throw new Error("Failed to delete file");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FILES] });
            toast.success(MESSAGES.SUCCESS.DELETE);
        },
        onError: () => {
            toast.error(MESSAGES.ERROR.DELETE);
        },
    });

    const bulkDeleteMutation = useMutation({
        mutationFn: async (keys: string[]) => {
            const response = await fetch(API_ENDPOINTS.FILES.BULK_DELETE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keys }),
            });
            if (!response.ok) throw new Error("Failed to delete files");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FILES] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATISTICS] });
            toast.success(MESSAGES.SUCCESS.BULK_DELETE);
        },
        onError: () => {
            toast.error(MESSAGES.ERROR.BULK_DELETE);
        },
    });

    const copyMutation = useMutation({
        mutationFn: async ({ sourceKey, destinationPath }: { sourceKey: string; destinationPath: string }) => {
            const response = await fetch(API_ENDPOINTS.FILES.COPY, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sourceKey, destinationPath }),
            });
            if (!response.ok) throw new Error("Failed to copy file");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FILES] });
            toast.success(MESSAGES.SUCCESS.COPY);
        },
        onError: () => {
            toast.error(MESSAGES.ERROR.COPY);
        },
    });

    const uploadMutation = useMutation({
        mutationFn: async (files: File[]) => {
            const results = await Promise.all(
                files.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file, file.name);
                    formData.append("path", currentPath);

                    const response = await fetch(API_ENDPOINTS.FILES.UPLOAD, {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error(`Upload failed for ${file.name}`);
                    }

                    return response.json();
                })
            );

            return results;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FILES] });
            toast.success(MESSAGES.SUCCESS.UPLOAD);
        },
        onError: (error) => {
            console.error("Upload error:", error);
            toast.error(MESSAGES.ERROR.UPLOAD);
        },
    });

    return {
        filesQuery,
        renameMutation,
        deleteMutation,
        bulkDeleteMutation,
        copyMutation,
        uploadMutation,
    };
};
