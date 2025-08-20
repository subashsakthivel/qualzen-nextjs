// import dbConnect from "@/lib/mongoose";
// import { UserInfoModel } from "@/model/UserInfo";
// async function checkAndAddUser(user: UserInfo) {
//   await dbConnect();
//   const existingUser = await UserInfoModel.findOne({
//     where: { email: user.email },
//   });

import Counter from "@/model/Counter";

//   if (!existingUser) {
//     await UserInfoModel.create(user);
//     console.log("User added to the database:", user);
//   } else {
//     console.log("User already exists in the database:", existingUser);
//   }
// }

// async function getUserByEmail(email: string) {
//   await dbConnect();
//   const user = await UserInfoModel.findOne({
//     email: email,
//   });
//   if (!user) {
//     console.log("User not found in the database:", email);
//   }
//   return user;
// }

// async function verifyEmailAndPassword(email: string) {
//   await dbConnect();
//   const user = await UserInfoModel.findOne({
//     email: email,
//   });
//   if (!user) {
//     console.log("User not found in the database:", email);
//     return null;
//   }
//   return user;
// }

class DatabaseUtil {
  async getSeq({ _id }: { _id: string }) {
    const seq = await Counter.findByIdAndUpdate(
      { _id },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return seq;
  }
}

const PersistanceUtil = new DatabaseUtil();

export default PersistanceUtil;
