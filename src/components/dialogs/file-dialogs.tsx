"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Folder } from "@/types";

interface CreateFolderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (name: string) => void;
    folderName: string;
    onFolderNameChange: (value: string) => void;
}

export function CreateFolderDialog({ isOpen, onClose, onConfirm, folderName, onFolderNameChange }: CreateFolderDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Input
                            id="name"
                            placeholder="Folder name"
                            value={folderName}
                            onChange={(e) => onFolderNameChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && folderName.trim()) {
                                    onConfirm(folderName);
                                }
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={() => onConfirm(folderName)} disabled={!folderName.trim()}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface CopyFileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (destinationPath: string) => void;
    currentPath: string;
    onPathChange: (path: string) => void;
    folders: Folder[];
}

export function CopyFileDialog({ isOpen, onClose, onConfirm, currentPath, onPathChange, folders }: CopyFileDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Destination Folder</DialogTitle>
                </DialogHeader>
                <Select value={currentPath} onValueChange={onPathChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select destination folder" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="/">Root</SelectItem>
                        {folders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                                {folder.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={() => onConfirm(currentPath)}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
}

export function DeleteDialog({ isOpen, onClose, onConfirm, title, description }: DeleteDialogProps) {
    return <ConfirmDialog isOpen={isOpen} onClose={onClose} onConfirm={onConfirm} title={title} description={description} variant="destructive" confirmText="Delete" />;
}
