import { NextResponse } from "next/server";
import { bulkDeleteFiles } from "@/lib/s3";

export async function POST(request: Request) {
    try {
        const { keys } = await request.json();

        if (!Array.isArray(keys) || keys.length === 0) {
            return NextResponse.json({ error: "No files to delete" }, { status: 400 });
        }

        await bulkDeleteFiles(keys);

        return NextResponse.json({ message: "Files deleted successfully" });
    } catch (error) {
        console.error("Error deleting files:", error);
        return NextResponse.json({ error: "Failed to delete files" }, { status: 500 });
    }
}
