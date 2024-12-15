"use client";

import React, { useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import { Pagination } from "@/components/ui/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { CreateFolderDialog, CopyFileDialog, DeleteDialog } from "@/components/dialogs/file-dialogs";
import { FileItem, EditingFile, Folder } from "@/types";
import { FileRow } from "@/components/ui/file-row";
import { FolderRow } from "@/components/ui/folder-row";
import { formatDateTime } from "@/lib/utils";
import { Breadcrumb } from "./ui/Breadcrumb";
import { Checkbox } from "./ui/checkbox";
import { useFiles } from "@/hooks/useFiles";
import { useFolders } from "@/hooks/useFolders";

const MotionDiv = dynamic(() => import("framer-motion").then((mod) => mod.motion.div), {
    ssr: false,
});

export function FileList({ onPathChange }: { onPathChange: (path: string) => void }) {
    const [editingFile, setEditingFile] = useState<EditingFile | null>(null);
    const [newFolderName, setNewFolderName] = useState("");
    const [currentPath, setCurrentPath] = useState<string>("/");
    const [currentToken, setCurrentToken] = useState<string | null>(null);
    const [previousTokens, setPreviousTokens] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery] = useDebounce(searchQuery, 500);
    const [showCopyDialog, setShowCopyDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDeleteFolderConfirm, setShowDeleteFolderConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<FileItem | null>(null);
    const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
    const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
    const [copyDestinationPath, setCopyDestinationPath] = useState<string>("/");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

    const {
        filesQuery: { data, isLoading },
        renameMutation,
        deleteMutation,
        bulkDeleteMutation,
        copyMutation,
    } = useFiles(currentToken, currentPath, debouncedQuery);

    const {
        foldersQuery: { data: folders = [] },
        createFolderMutation,
        deleteFolderMutation,
    } = useFolders(currentPath);

    const handleRename = (file: FileItem) => {
        if (!file.name) return;
        const extension = file.name.split(".").pop() || "";
        const nameWithoutExt = file.name.replace(`.${extension}`, "");

        setEditingFile({
            key: file.key,
            newName: nameWithoutExt,
        });
    };

    const handleSaveRename = async () => {
        if (!editingFile || !editingFile.newName.trim()) return;

        try {
            await renameMutation.mutateAsync({
                oldKey: editingFile.key,
                newName: editingFile.newName,
            });
            setEditingFile(null);
        } catch (error) {
            console.error("Rename error:", error);
        }
    };

    const handleRenameClick = (e: React.MouseEvent<HTMLButtonElement>, file: FileItem) => {
        e.stopPropagation();
        handleRename(file);
    };

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, file: FileItem) => {
        e.stopPropagation();
        setItemToDelete(file);
        setShowDeleteConfirm(true);
    };

    const handleSaveRenameClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        handleSaveRename();
    };

    const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setEditingFile(null);
    };

    const handleFolderClick = (folderId: string) => {
        setCurrentPath(folderId);
        setCurrentToken(null);
        setPreviousTokens([]);
        onPathChange(folderId);
    };

    const handlePathChange = (newPath: string) => {
        setCurrentPath(newPath);
        setCurrentToken(null);
        setPreviousTokens([]);
        onPathChange(newPath);
    };

    const handleNextPage = () => {
        if (data?.nextContinuationToken) {
            setPreviousTokens([...previousTokens, currentToken || ""]);
            setCurrentToken(data.nextContinuationToken);
        }
    };

    const handlePreviousPage = () => {
        const previousToken = previousTokens[previousTokens.length - 1];
        setPreviousTokens(previousTokens.slice(0, -1));
        setCurrentToken(previousToken || null);
    };

    const handleCopy = (file: FileItem) => {
        setSelectedFile(file);
        setShowCopyDialog(true);
    };

    const handleCopyConfirm = (destinationPath: string) => {
        if (!selectedFile) return;
        copyMutation.mutate({
            sourceKey: selectedFile.key,
            destinationPath,
        });
        setShowCopyDialog(false);
        setSelectedFile(null);
    };

    const handleDeleteFolder = (e: React.MouseEvent<HTMLButtonElement>, folder: Folder) => {
        e.stopPropagation();
        setFolderToDelete(folder);
        setShowDeleteFolderConfirm(true);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allFileKeys = data?.files.map((file) => file.key) || [];
            setSelectedItems(allFileKeys);
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (key: string, checked: boolean) => {
        if (checked) {
            setSelectedItems((prev) => [...prev, key]);
        } else {
            setSelectedItems((prev) => prev.filter((k) => k !== key));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedItems.length > 0) {
            try {
                await bulkDeleteMutation.mutateAsync(selectedItems);
                setSelectedItems([]);
                setShowBulkDeleteConfirm(false);
            } catch (error) {
                console.error("Bulk delete error:", error);
            }
        }
    };

    if (isLoading) return <div>Loading...</div>;

    const allSelected = data?.files.length === selectedItems.length && data?.files.length > 0;
    const someSelected = selectedItems.length > 0 && !allSelected;

    return (
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="h-full">
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>File List</CardTitle>
                    <div className="flex items-center gap-2">
                        {selectedItems.length > 0 && (
                            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete {selectedItems.length} files
                            </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setShowCreateFolderDialog(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Folder
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Breadcrumb currentPath={currentPath} onPathChange={handlePathChange} />
                    <div className="flex items-center gap-4 mb-4">
                        <Input placeholder="Search files..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-sm" />
                    </div>

                    {data?.files.length === 0 && folders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <FileIcon className="h-12 w-12 mb-4" />
                            <p className="text-lg font-medium">No files yet</p>
                            <p className="text-sm">Upload your first file</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[30px]">
                                        <Checkbox checked={allSelected} indeterminate={someSelected} onCheckedChange={handleSelectAll} />
                                    </TableHead>
                                    <TableHead>File Name</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Link</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {folders.map((folder, index) => (
                                    <FolderRow
                                        key={folder.id}
                                        folder={folder}
                                        index={index}
                                        onFolderClick={handleFolderClick}
                                        onDelete={handleDeleteFolder}
                                        formatDateTime={formatDateTime}
                                    />
                                ))}
                                {data?.files.map((file, index) => (
                                    <FileRow
                                        key={file.key}
                                        file={file}
                                        index={index}
                                        editingFile={editingFile}
                                        setEditingFile={setEditingFile}
                                        onRename={handleRenameClick}
                                        onCopy={handleCopy}
                                        onDelete={handleDeleteClick}
                                        onSaveRename={handleSaveRenameClick}
                                        onCancelRename={handleCancelClick}
                                        renameMutation={renameMutation}
                                        formatDateTime={formatDateTime}
                                        isSelected={selectedItems.includes(file.key)}
                                        onSelect={(checked) => handleSelectItem(file.key, checked)}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    <Pagination
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                        hasNextPage={data?.isTruncated || false}
                        hasPreviousPage={previousTokens.length > 0}
                    />
                </CardContent>
            </Card>

            <CreateFolderDialog
                isOpen={showCreateFolderDialog}
                onClose={() => setShowCreateFolderDialog(false)}
                onConfirm={(name) => {
                    createFolderMutation.mutate(name);
                    setShowCreateFolderDialog(false);
                }}
                folderName={newFolderName}
                onFolderNameChange={setNewFolderName}
            />

            <CopyFileDialog
                isOpen={showCopyDialog}
                onClose={() => {
                    setShowCopyDialog(false);
                    setCopyDestinationPath("/");
                }}
                onConfirm={handleCopyConfirm}
                currentPath={copyDestinationPath}
                onPathChange={setCopyDestinationPath}
                folders={folders}
            />

            <DeleteDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={() => {
                    if (itemToDelete) {
                        deleteMutation.mutate(itemToDelete.key);
                        setItemToDelete(null);
                    }
                }}
                title="Delete File"
                description={`Are you sure you want to delete "${itemToDelete?.name}"?`}
            />

            <DeleteDialog
                isOpen={showDeleteFolderConfirm}
                onClose={() => setShowDeleteFolderConfirm(false)}
                onConfirm={() => {
                    if (folderToDelete) {
                        deleteFolderMutation.mutate(folderToDelete.id);
                        setFolderToDelete(null);
                    }
                }}
                title="Delete Folder"
                description={`Are you sure you want to delete "${folderToDelete?.name}" folder?`}
            />

            <DeleteDialog
                isOpen={showBulkDeleteConfirm}
                onClose={() => setShowBulkDeleteConfirm(false)}
                onConfirm={() => {
                    bulkDeleteMutation.mutate(selectedItems);
                    setShowBulkDeleteConfirm(false);
                }}
                title="Delete Multiple Files"
                description={`Are you sure you want to delete ${selectedItems.length} selected files?`}
            />
        </MotionDiv>
    );
}
