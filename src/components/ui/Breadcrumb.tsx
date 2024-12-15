"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface BreadcrumbProps {
    currentPath: string;
    onPathChange: (path: string) => void;
}

export function Breadcrumb({ currentPath, onPathChange }: BreadcrumbProps) {
    const parts = currentPath.split("/").filter(Boolean);

    return (
        <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={() => onPathChange("/")} className={currentPath === "/" ? "font-bold" : ""}>
                Root
            </Button>
            {parts.map((part, index) => (
                <React.Fragment key={part}>
                    <span>/</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPathChange(`/${parts.slice(0, index + 1).join("/")}/`)}
                        className={index === parts.length - 1 ? "font-bold" : ""}
                    >
                        {part}
                    </Button>
                </React.Fragment>
            ))}
        </div>
    );
}
