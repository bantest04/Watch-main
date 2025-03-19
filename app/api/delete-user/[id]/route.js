import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import dbConnect from "@/utils/config/dbConnection";
import User from "@/utils/models/User";

export async function DELETE(req, { params }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { id } = params;

  try {
    // Check if the user is deleting their own account or if they are an admin
    if (session.user._id !== id) {
      const currentUser = await User.findById(session.user._id);
      if (!currentUser.admin) {
        return NextResponse.json(
          {
            error: "Not authorized",
          },
          { status: 401 }
        );
      }
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // If the user is deleting their own account, clear the session cookies
    if (session.user._id === id) {
      const response = NextResponse.json({ message: "Account deleted successfully" });
      response.cookies.set({
        name: "next-auth.session-token",
        value: "",
        expires: new Date(0),
        httpOnly: true,
        path: "/",
      });
      response.cookies.set({
        name: "__Secure-next-auth.session-token",
        value: "",
        expires: new Date(0),
        httpOnly: true,
        path: "/",
      });
      response.cookies.set({
        name: "next-auth.csrf-token",
        value: "",
        expires: new Date(0),
        httpOnly: true,
        path: "/",
      });
      response.cookies.set({
        name: "__Host-next-auth.csrf-token",
        value: "",
        expires: new Date(0),
        httpOnly: true,
        path: "/",
      });
      return response;
    } else {
        // If an admin is deleting another user, don't clear cookies
        return NextResponse.json({ message: "User deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
