import { FileIcon } from "lucide-react";

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FileIcon className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">Chưa có file nào</p>
            <p className="text-sm">Hãy upload file đầu tiên của bạn</p>
        </div>
    );
}
