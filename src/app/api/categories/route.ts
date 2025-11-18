import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Category from "@/models/Category";
import { authenticate } from "@/lib/server/authMiddleware"; 

export async function GET(request: Request) {
    try {
        await dbConnect();

        await authenticate(request);

        const categories = await Category.find({});
        return NextResponse.json(categories);

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
