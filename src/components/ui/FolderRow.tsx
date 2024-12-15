import { Folder, Trash2 } from "lucide-react";
import { Button } from "./button";
import { TableCell } from "./table";
import { Folder as FolderType } from "@/types/file";
import { formatDateTime } from "@/utils/file";
import { MotionTableRow } from "./motion";

interface FolderRowProps {
    folder: FolderType;
    index: number;
    onFolderClick: (folderId: string) => void;
    onDelete: (e: React.MouseEvent) => void;
}

export function FolderRow({ folder, index, onFolderClick, onDelete }: FolderRowProps) {
    return (
        <MotionTableRow
            key={folder.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
            onClick={() => onFolderClick(folder.id)}
        >
            <TableCell className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                <span>{folder.name}</span>
            </TableCell>
            <TableCell>-</TableCell>
            <TableCell>{formatDateTime(folder.createdAt)}</TableCell>
            <TableCell>-</TableCell>
            <TableCell className="text-right space-x-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="transition-colors hover:bg-destructive/10"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(e);
                    }}
                >
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </TableCell>
        </MotionTableRow>
    );
}
