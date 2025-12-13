import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

async function dbConnect() {
  try {
    if (connection.isConnected) {
      return;
    }

    const db = await mongoose.connect(process.env.MONGODB_URI!);
    console.log("connected to db : ", process.env.MONGODB_URI, db.connection.readyState);
    connection.isConnected = db.connection.readyState;
  } catch (error) {
    console.log("DB Connection ERROR ", error);
    throw error;
  }
}

export default dbConnect;
