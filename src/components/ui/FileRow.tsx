import { FileIcon, ExternalLink, Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { TableCell } from "./table";
import { FileItem, EditingFile } from "@/types/file";
import { formatDateTime, truncateFilename } from "@/utils/file";
import { MotionTableRow } from "./motion";

interface FileRowProps {
    file: FileItem;
    index: number;
    editingFile: EditingFile | null;
    onRename: (file: FileItem) => void;
    onDelete: (e: React.MouseEvent, file: FileItem) => void;
    onSaveRename: (e: React.MouseEvent) => void;
    onCancelRename: (e: React.MouseEvent) => void;
    onEditingChange: (editingFile: EditingFile) => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    isRenamePending: boolean;
}

export function FileRow({ file, index, editingFile, onRename, onDelete, onSaveRename, onCancelRename, onEditingChange, onKeyPress, isRenamePending }: FileRowProps) {
    return (
        <MotionTableRow
            key={file.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border-b transition-colors hover:bg-muted/50"
        >
            <TableCell className="flex items-center gap-2">
                <FileIcon className="h-4 w-4" />
                {editingFile?.key === file.key ? (
                    <div className="flex items-center gap-1">
                        <Input
                            value={editingFile.newName}
                            onChange={(e) => onEditingChange({ ...editingFile, newName: e.target.value })}
                            onKeyPress={onKeyPress}
                            className="h-8"
                            autoFocus
                        />
                        <span className="text-muted-foreground">.{file.name.split(".").pop()}</span>
                    </div>
                ) : (
                    <span title={file.name}>{truncateFilename(file.name)}</span>
                )}
            </TableCell>
            <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </TableCell>
            <TableCell>{formatDateTime(file.lastModified)}</TableCell>
            <TableCell>
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                    M <ExternalLink className="h-4 w-4" />
                </a>
            </TableCell>
            <TableCell className="text-right space-x-2">
                {editingFile?.key === file.key ? (
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={onSaveRename} disabled={isRenamePending}>
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onCancelRename} disabled={isRenamePending}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="transition-colors hover:bg-primary/10 hover:text-primary" onClick={() => onRename(file)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="transition-colors hover:bg-destructive/10" onClick={(e) => onDelete(e, file)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                )}
            </TableCell>
        </MotionTableRow>
    );
}
