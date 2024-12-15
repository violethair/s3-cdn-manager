"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
    onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [status, setStatus] = useState<"checking" | "success" | "error">("checking");

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await fetch("/api/health");
                if (response.ok) {
                    setStatus("success");
                    setTimeout(() => {
                        onComplete();
                    }, 1000); // Wait 1s after showing success icon
                } else {
                    setStatus("error");
                }
            } catch {
                setStatus("error");
            }
        };

        checkConnection();
    }, [onComplete]);

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="flex items-center gap-2 text-lg font-medium">
                        {status === "checking" && (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span>Checking S3 connection...</span>
                            </>
                        )}
                        {status === "success" && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-success">
                                <Check className="h-6 w-6" />
                                <span>Connected successfully!</span>
                            </motion.div>
                        )}
                        {status === "error" && (
                            <div className="text-destructive">
                                <span>Cannot connect to S3</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
