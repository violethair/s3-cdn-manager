import { NextResponse } from "next/server";
import { checkHealth } from "@/lib/s3";

export async function GET() {
    try {
        const isHealthy = await checkHealth();

        if (isHealthy) {
            return NextResponse.json({ status: "ok" });
        } else {
            return NextResponse.json({ status: "error" }, { status: 500 });
        }
    } catch (error) {
        console.error("Health check error:", error);
        return NextResponse.json({ status: "error" }, { status: 500 });
    }
}
