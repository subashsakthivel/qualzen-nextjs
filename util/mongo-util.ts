import dbConnect from "@/lib/mongoose";
import { UserInfo, UserInfoModel } from "@/model/UserInfo";

async function checkAndAddUser(user: UserInfo) {
  await dbConnect();
  const existingUser = await UserInfoModel.findOne({
    where: { email: user.email },
  });

  if (!existingUser) {
    await UserInfoModel.create(user);
    console.log("User added to the database:", user);
  } else {
    console.log("User already exists in the database:", existingUser);
  }
}

const MONGODB_UTIL = {
  checkAndAddUser,
};

export default MONGODB_UTIL;
