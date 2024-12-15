import { NextResponse } from "next/server";
import { listAllFiles, createFolder } from "@/lib/s3";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        let prefix = searchParams.get("prefix") || "";

        if (prefix.startsWith("/")) {
            prefix = prefix.substring(1);
        }

        const { folders } = await listAllFiles(prefix);
        return NextResponse.json(folders);
    } catch (error) {
        console.error("Error listing folders:", error);
        return NextResponse.json({ error: "Failed to list folders" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name } = await request.json();
        const folder = await createFolder(name);
        return NextResponse.json(folder);
    } catch (error) {
        console.error("Error creating folder:", error);
        return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
    }
}
