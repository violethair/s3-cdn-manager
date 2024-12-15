import { NextResponse } from "next/server";
import { deleteFiles } from "@/lib/s3";

export async function POST(request: Request) {
    try {
        const { key } = await request.json();

        if (!key) {
            return NextResponse.json({ error: "File key is required" }, { status: 400 });
        }

        await deleteFiles([key]);
        return NextResponse.json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
}
