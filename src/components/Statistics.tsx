import { Card, CardContent } from "@/components/ui/card";
import { FileIcon, FolderIcon, HardDriveIcon } from "lucide-react";
import { useStatistics } from "@/hooks/useStatistics";

interface StatisticsProps {
    currentPath: string;
}

export function Statistics({ currentPath }: StatisticsProps) {
    const { data } = useStatistics(currentPath);

    return (
        <Card className="h-full">
            <CardContent className="h-full flex flex-col justify-center gap-4 p-6">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <FileIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Files</p>
                        <p className="text-2xl font-bold">{data?.totalFiles || 0}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <FolderIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Folders</p>
                        <p className="text-2xl font-bold">{data?.totalFolders || 0}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <HardDriveIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Storage</p>
                        <p className="text-2xl font-bold">{data ? (data.totalSize / 1024 / 1024).toFixed(2) : 0} MB</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
