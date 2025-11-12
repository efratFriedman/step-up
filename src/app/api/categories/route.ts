import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Category from "@/models/Category";

export async function GET() {
    try{
        await dbConnect();
        const categories = await Category.find({});
        return NextResponse.json(categories);
    }catch(err: any){
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}