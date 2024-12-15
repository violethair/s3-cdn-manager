import { NextResponse } from "next/server";
import { getStatistics } from "@/lib/s3";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const path = searchParams.get("path") || "/";

        const stats = await getStatistics(path);
        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error fetching statistics:", error);
        return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
    }
}
