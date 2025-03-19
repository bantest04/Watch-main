import { NextResponse } from "next/server";
import dbConnect from "@/utils/config/dbConnection";
import User from "@/utils/models/User"; // Import model User

export async function GET(req) {
  await dbConnect();

  try {
    // 1. Lấy tất cả người dùng
    const users = await User.find({}, "_id email name admin").sort({createdAt: -1}); // Chỉ lấy các trường cần thiết

    // 2. Kiểm tra xem có user nào không
    if (!users || users.length === 0) {
      return NextResponse.json({
        message: "No users found",
        users: [],
        totalUsers:0
      });
    }
   const userList = users.map((user) => {
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      admin: user.admin,
    };
  });
    // 3. Trả về danh sách người dùng
    return NextResponse.json({
      users: userList,
      totalUsers: userList.length,
    });
  } catch (error) {
    console.error("Error fetching user list:", error);
    return NextResponse.json(
      {
        error: "Internal server error at api/userlist",
      },
      { status: 500 }
    );
  }
}
