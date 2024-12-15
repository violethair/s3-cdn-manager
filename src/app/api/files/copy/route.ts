import { NextResponse } from "next/server";
import { copyFile } from "@/lib/s3";

export async function POST(request: Request) {
    try {
        const { sourceKey, destinationPath } = await request.json();

        if (!sourceKey) {
            return NextResponse.json({ error: "Source key is required" }, { status: 400 });
        }

        const destinationKey = await copyFile(sourceKey, destinationPath);

        return NextResponse.json({
            success: true,
            message: "File copied successfully",
            destinationKey,
        });
    } catch (error) {
        console.error("Error copying file:", error);
        return NextResponse.json({ error: "Failed to copy file" }, { status: 500 });
    }
}
