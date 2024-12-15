import { NextResponse } from "next/server";
import { deleteFolder } from "@/lib/s3";

export async function POST(request: Request) {
    try {
        const { folderId } = await request.json();

        if (!folderId) {
            return NextResponse.json({ error: "Folder ID is required" }, { status: 400 });
        }

        await deleteFolder(folderId);
        return NextResponse.json({ message: "Folder deleted successfully" });
    } catch (error) {
        console.error("Error deleting folder:", error);
        return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
    }
}
