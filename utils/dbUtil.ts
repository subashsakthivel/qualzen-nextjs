import dbConnect from "@/lib/mongoose";
import { UserInfo, UserInfoModel, userInfoObject } from "@/model/UserInfo";
import { userInfo } from "os";

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

async function getUserByEmail(email: string) {
  await dbConnect();
  const user = await UserInfoModel.findOne({
    email: email,
  });
  if (!user) {
    console.log("User not found in the database:", email);
  }
  return user;
}

async function verifyEmailAndPassword(email: string) {
  await dbConnect();
  const user = await UserInfoModel.findOne({
    email: email,
  });
  if (!user) {
    console.log("User not found in the database:", email);
    return null;
  }
  return user;
}

export { checkAndAddUser, getUserByEmail, verifyEmailAndPassword };
