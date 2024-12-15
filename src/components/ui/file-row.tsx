"use client";

import { FileIcon, ExternalLink, Pencil, Copy, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import { FileItem, EditingFile } from "@/types";
import { formatFileSize, truncateFilename } from "@/lib/utils";
import { UseMutationResult } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";

interface RenameResponse {
    success: boolean;
    message: string;
    newKey: string;
}

interface FileRowProps {
    file: FileItem;
    index: number;
    editingFile: EditingFile | null;
    setEditingFile: (file: EditingFile | null) => void;
    onRename: (e: React.MouseEvent<HTMLButtonElement>, file: FileItem) => void;
    onCopy: (file: FileItem) => void;
    onDelete: (e: React.MouseEvent<HTMLButtonElement>, file: FileItem) => void;
    onSaveRename: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onCancelRename: (e: React.MouseEvent<HTMLButtonElement>) => void;
    renameMutation: UseMutationResult<RenameResponse, Error, { oldKey: string; newName: string }>;
    formatDateTime: (date: string) => string;
    isSelected: boolean;
    onSelect: (checked: boolean) => void;
}

export function FileRow({
    file,
    index,
    editingFile,
    setEditingFile,
    onRename,
    onCopy,
    onDelete,
    onSaveRename,
    onCancelRename,
    renameMutation,
    formatDateTime,
    isSelected,
    onSelect,
}: FileRowProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && editingFile?.newName.trim()) {
            onSaveRename(e as unknown as React.MouseEvent<HTMLButtonElement>);
        }
    };

    return (
        <motion.tr
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border-b transition-colors hover:bg-muted/50"
        >
            <TableCell className="w-[30px]">
                <Checkbox checked={isSelected} onCheckedChange={onSelect} />
            </TableCell>
            <TableCell className="align-middle h-[40px]">
                <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4" />
                    {editingFile?.key === file.key && editingFile ? (
                        <div className="flex items-center gap-1">
                            <Input
                                value={editingFile.newName}
                                onChange={(e) => setEditingFile({ ...editingFile, newName: e.target.value })}
                                onKeyDown={handleKeyDown}
                                className="h-8"
                                autoFocus
                            />
                            <span className="text-muted-foreground">.{file.name.split(".").pop()}</span>
                        </div>
                    ) : (
                        <span className="flex items-center" title={file.name}>
                            {truncateFilename(file.name)}
                        </span>
                    )}
                </div>
            </TableCell>
            <TableCell className="align-middle">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">{formatFileSize(file.size)}</span>
            </TableCell>
            <TableCell className="align-middle">{formatDateTime(file.lastModified)}</TableCell>
            <TableCell className="align-middle">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                    Mở <ExternalLink className="h-4 w-4" />
                </a>
            </TableCell>
            <TableCell className="text-right space-x-2 align-middle">
                {editingFile !== null && editingFile.key === file.key ? (
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={onSaveRename} disabled={renameMutation.isPending}>
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onCancelRename} disabled={renameMutation.isPending}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="transition-colors hover:bg-primary/10 hover:text-primary" onClick={(e) => onRename(e, file)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="transition-colors hover:bg-primary/10 hover:text-primary" onClick={() => onCopy(file)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="transition-colors hover:bg-destructive/10" onClick={(e) => onDelete(e, file)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                )}
            </TableCell>
        </motion.tr>
    );
}
