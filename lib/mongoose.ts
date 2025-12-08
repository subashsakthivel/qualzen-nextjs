import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

async function dbConnect() {
  try {
    if (connection.isConnected) {
      return;
    }
    console.log("connecting to db : ", process.env.MONGODB_URI);
    const db = await mongoose.connect(process.env.MONGODB_URI!);

    connection.isConnected = db.connection.readyState;
  } catch (error) {
    console.log("DB Connection ERROR ", error);
    throw error;
  }
}

mongoose.plugin((schema) => {
  schema.set("toJSON", {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  });

  schema.set("toObject", {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  });
});

export default dbConnect;
