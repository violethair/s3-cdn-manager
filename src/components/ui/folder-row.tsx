"use client";

import { FolderIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { Folder } from "@/types";
import { motion } from "framer-motion";

interface FolderRowProps {
    folder: Folder;
    index: number;
    onFolderClick: (folderId: string) => void;
    onDelete: (e: React.MouseEvent<HTMLButtonElement>, folder: Folder) => void;
    formatDateTime: (date: string) => string;
}

export function FolderRow({ folder, index, onFolderClick, onDelete, formatDateTime }: FolderRowProps) {
    return (
        <motion.tr
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
            onClick={() => onFolderClick(folder.id)}
        >
            <TableCell className="w-[30px] align-middle" />
            <TableCell className="align-middle h-[40px]">
                <div className="flex items-center gap-2">
                    <FolderIcon className="h-4 w-4" />
                    <span>{folder.name}</span>
                </div>
            </TableCell>
            <TableCell className="align-middle">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">Folder</span>
            </TableCell>
            <TableCell className="align-middle">{formatDateTime(folder.createdAt)}</TableCell>
            <TableCell className="align-middle">-</TableCell>
            <TableCell className="text-right space-x-2 align-middle">
                <Button
                    variant="ghost"
                    size="icon"
                    className="transition-colors hover:bg-destructive/10"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(e, folder);
                    }}
                >
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </TableCell>
        </motion.tr>
    );
}
