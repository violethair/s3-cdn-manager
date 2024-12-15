import { NextResponse } from "next/server";
import { renameFile } from "@/lib/s3";

export async function POST(request: Request) {
    try {
        const { oldKey, newName } = await request.json();

        if (!oldKey || !newName) {
            return NextResponse.json({ error: "Old key and new name are required" }, { status: 400 });
        }

        const renamedFile = await renameFile(oldKey, newName);
        return NextResponse.json(renamedFile);
    } catch (error) {
        console.error("Error renaming file:", error);
        return NextResponse.json({ error: "Failed to rename file" }, { status: 500 });
    }
}
