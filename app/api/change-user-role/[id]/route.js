import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import dbConnect from "@/utils/config/dbConnection";
import User from "@/utils/models/User";

export async function PUT(req, { params }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const id = params.id;

  try {
    // Check if the id is valid
    if (!id) {
      return NextResponse.json(
        {
          error: "Invalid user ID",
        },
        { status: 400 }
      );
    }
    const currentUser = await User.findById(session.user._id);
    if (!currentUser) {
      return NextResponse.json(
        {
          error: "Current user not found",
        },
        { status: 404 }
      );
    }
    if (!currentUser.admin) {
      return NextResponse.json(
        {
          error: "Not authorized",
        },
        { status: 403 } // Changed status code to 403 Forbidden
      );
    }
    const body = await req.json();
    // Check if the body data is valid
    if (!body || typeof body.admin !== 'boolean') {
      return NextResponse.json(
        {
          error: "Invalid request body. 'admin' field must be a boolean.",
        },
        { status: 400 }
      );
    }
    const { admin } = body;

    // Check if the user being updated is the same as the current user
    if (currentUser._id.toString() === id) {
      return NextResponse.json(
        {
          error: "Cannot change your own role",
        },
        { status: 400 } // Bad Request
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { admin },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
