// utils/config/updateUserData.js
import dbConnect from "./dbConnection";
import User from "../models/User";

async function updateUserData() {
  await dbConnect();

  try {
    const users = await User.find({});
    for (const user of users) {
        await User.findByIdAndUpdate(user._id,{admin: user.role === 'admin' ? true : false}, { new: true })
    }

    console.log("User data updated successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error updating user data:", error);
    process.exit(1);
  }
}

updateUserData();
