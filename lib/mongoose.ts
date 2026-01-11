import mongoose from "mongoose";

const connection: { isConnected?: number; db?: typeof mongoose } = {};

async function dbConnect() {
  try {
    if (connection.isConnected && connection.db) {
      return connection.db;
    }
    console.log("connecting to db : ", process.env.MONGODB_URI);
    connection.db = await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("connected to db : ", process.env.MONGODB_URI, connection.db.connection.readyState);
    connection.isConnected = connection.db.connection.readyState;
    return connection.db;
  } catch (error) {
    console.log("DB Connection ERROR ", error);
    throw error;
  }
}

export default dbConnect;
