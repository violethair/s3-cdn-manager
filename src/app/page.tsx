"use client";

import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { FileList } from "@/components/FileList";
import { LoadingScreen } from "@/components/LoadingScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Statistics } from "@/components/Statistics";

const queryClient = new QueryClient();

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPath, setCurrentPath] = useState("/");

    return (
        <QueryClientProvider client={queryClient}>
            {isLoading ? (
                <LoadingScreen onComplete={() => setIsLoading(false)} />
            ) : (
                <main className="min-h-screen p-8">
                    <div className="container max-w-[1300px] mx-auto space-y-12">
                        <h1 className="text-2xl font-bold text-center">File Upload Manager</h1>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-[300px]">
                                <FileUpload currentPath={currentPath} />
                            </div>
                            <div className="h-[300px]">
                                <Statistics currentPath={currentPath} />
                            </div>
                        </div>

                        <div>
                            <FileList onPathChange={setCurrentPath} />
                        </div>
                    </div>
                </main>
            )}
        </QueryClientProvider>
    );
}
