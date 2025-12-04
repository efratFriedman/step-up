import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import { habitSchema } from "@/lib/validation/habitValidation";
import mongoose from "mongoose";
import { authenticate } from "@/lib/server/authMiddleware";
import { deleteHabitWithFutureLogs, updateHabitWithFutureLogs } from "@/services/server/habitService";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    const userId = user._id;

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const habit = await Habit.findOne({ _id: id, userId });

    if (!habit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json(habit);
  } catch (error: any) {
    console.error("GET /habits/[id] error:", error);
    return NextResponse.json(
      { message: error.message ?? "Failed" },
      { status: 401 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    const userId = user._id;

    const { id } = await context.params;

    const body = await req.json();

    const parsed = habitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const updatedHabit = await updateHabitWithFutureLogs(id, userId, parsed.data);

    return NextResponse.json(updatedHabit);

  } catch (error: any) {
    console.error("PUT /habits/[id] error:", error);
    return NextResponse.json(
      { message: error.message ?? "Failed" },
      { status: 401 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    if (!user || !user._id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user._id;
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const deletedResult = await deleteHabitWithFutureLogs(id, userId.toString());
    
    // Verify the deletion happened
    const habitStillExists = await Habit.findOne({ _id: id, userId });
    if (habitStillExists) {
      console.error("Habit deletion failed - habit still exists");
      return NextResponse.json(
        { message: "Failed to delete habit" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: "Habit deleted successfully",
      ok: deletedResult.ok
    });
    
  } catch (error: any) {
    console.error("DELETE /habits/[id] error:", error);
    return NextResponse.json(
      { message: error.message ?? "Failed to delete habit" },
      { status: 500 }
    );
  }
}