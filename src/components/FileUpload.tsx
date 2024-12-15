"use client";

import React, { useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";
import { Upload, File as FileIcon, Loader2, FolderIcon, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useFiles } from "@/hooks/useFiles";

const validationSchema = Yup.object({
    files: Yup.array().of(Yup.mixed<File>()).min(1, "Please select at least 1 file"),
});

interface FormValues {
    files: File[];
}

const MotionDiv = dynamic(() => import("framer-motion").then((mod) => mod.motion.div), {
    ssr: false,
});

export function FileUpload({ currentPath }: { currentPath: string }) {
    const { uploadMutation } = useFiles(null, currentPath, "");

    const formik = useFormik<FormValues>({
        initialValues: {
            files: [],
        },
        validationSchema,
        onSubmit: async (values) => {
            if (values.files.length > 0) {
                try {
                    await uploadMutation.mutateAsync(values.files);
                    formik.resetForm();
                } catch (error) {
                    console.error("Upload error:", error);
                }
            }
        },
    });

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            formik.setFieldValue("files", [...formik.values.files, ...acceptedFiles]);
        },
        [formik]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
    });

    const removeFile = (index: number) => {
        const newFiles = [...formik.values.files];
        newFiles.splice(index, 1);
        formik.setFieldValue("files", newFiles);
    };

    return (
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="h-full">
            <Card className="h-full flex flex-col border-0">
                <CardContent className="flex-1 flex flex-col p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <FolderIcon className="h-4 w-4" />
                        <span>Current path:</span>
                        <code className="bg-muted px-2 py-0.5 rounded">{currentPath}</code>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="flex-1 flex flex-col">
                        <div
                            {...getRootProps()}
                            className={`flex-1 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                                ${isDragActive ? "border-primary bg-primary/5 scale-105" : "border-border"}
                                ${formik.values.files.length > 0 ? "bg-success/5 border-success" : ""}
                                hover:border-primary hover:bg-primary/5`}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center gap-2">
                                {formik.values.files.length > 0 ? (
                                    <div className="w-full space-y-2">
                                        {formik.values.files.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-background/50 p-2 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <FileIcon className="h-4 w-4 text-success" />
                                                    <span className="text-sm">{file.name}</span>
                                                    <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(index);
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <p className="text-sm text-muted-foreground mt-2">Drag and drop more files or click to select</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="h-10 w-10 text-muted-foreground" />
                                        {isDragActive ? (
                                            <p>Drop files here ...</p>
                                        ) : (
                                            <>
                                                <p>Drag and drop files here or click to select</p>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {formik.errors.files && <div className="text-red-500 text-sm text-center mt-4">{formik.errors.files as string}</div>}

                        <Button
                            type="submit"
                            disabled={uploadMutation.isPending || formik.values.files.length === 0}
                            className="w-full h-12 text-base font-medium transition-transform active:scale-95 mt-4"
                        >
                            {uploadMutation.isPending ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Uploading...</span>
                                </div>
                            ) : (
                                `Upload ${formik.values.files.length} files`
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </MotionDiv>
    );
}
