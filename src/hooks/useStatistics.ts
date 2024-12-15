import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, QUERY_KEYS } from "@/constants";

interface Statistics {
    totalFiles: number;
    totalFolders: number;
    totalSize: number;
}

export const useStatistics = (currentPath: string) => {
    return useQuery<Statistics>({
        queryKey: [QUERY_KEYS.STATISTICS, currentPath],
        queryFn: async () => {
            const response = await fetch(`${API_ENDPOINTS.STATISTICS}?path=${encodeURIComponent(currentPath)}`);
            if (!response.ok) throw new Error("Failed to fetch statistics");
            return response.json();
        },
    });
};
