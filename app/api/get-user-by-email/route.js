import { NextResponse } from "next/server";
import dbConnect from "@/utils/config/dbConnection";
import User from "@/utils/models/User";

export async function GET(req) {
    await dbConnect();
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
