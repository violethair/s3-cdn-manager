import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS, QUERY_KEYS, MESSAGES } from "@/constants";
import { Folder } from "@/types";
import { toast } from "sonner";

export const useFolders = (currentPath: string) => {
    const queryClient = useQueryClient();

    const foldersQuery = useQuery<Folder[]>({
        queryKey: [QUERY_KEYS.FOLDERS, currentPath],
        queryFn: async () => {
            const response = await fetch(`${API_ENDPOINTS.FOLDERS.LIST}?prefix=${currentPath}`);
            if (!response.ok) throw new Error("Failed to fetch folders");
            return response.json();
        },
    });

    const createFolderMutation = useMutation({
        mutationFn: async (name: string) => {
            const response = await fetch(API_ENDPOINTS.FOLDERS.LIST, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            if (!response.ok) throw new Error("Failed to create folder");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FILES] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLDERS] });
            toast.success(MESSAGES.SUCCESS.CREATE_FOLDER);
        },
        onError: () => {
            toast.error(MESSAGES.ERROR.CREATE_FOLDER);
        },
    });

    const deleteFolderMutation = useMutation({
        mutationFn: async (folderId: string) => {
            const response = await fetch(API_ENDPOINTS.FOLDERS.DELETE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ folderId }),
            });
            if (!response.ok) throw new Error("Failed to delete folder");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLDERS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FILES] });
            toast.success(MESSAGES.SUCCESS.DELETE_FOLDER);
        },
        onError: () => {
            toast.error(MESSAGES.ERROR.DELETE_FOLDER);
        },
    });

    return {
        foldersQuery,
        createFolderMutation,
        deleteFolderMutation,
    };
};
