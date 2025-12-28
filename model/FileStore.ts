import { TCategory } from "@/schema/Category";
import { TFileStore } from "@/schema/FileStore";
import R2Util from "@/util/server/file/S3Util";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const FileStoreDbSchema = new mongoose.Schema<TFileStore>({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  refCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

FileStoreDbSchema.pre("updateOne", async function (next: any) {
  const update = this.getUpdate();
  console.log(update);
  if (update && !Array.isArray(update)) {
    if (update.$set) {
      update.$set.updatedAt = new Date();
    }
    if (update.$inc && update.$inc.refCount && update.$inc.refCount < 0) {
      const fileBefore = await this.model.findOne(this.getQuery());
      if (fileBefore) {
        const oldRefCount = fileBefore.refCount;
        const decrementBy = update.$inc.refCount;
        const newRefCount = oldRefCount + decrementBy;
        if (newRefCount <= 0) {
          await R2Util.deleteFile(fileBefore.key);
        }
      }
    }
  }

  next();
});

FileStoreDbSchema.plugin(mongoosePaginate); //todo: need to remove paginate later

export const FileStoreModel =
  (mongoose.models?.FileStore as unknown as mongoose.PaginateModel<TFileStore>) ||
  mongoose.model<TFileStore, mongoose.PaginateModel<TFileStore>>("FileStore", FileStoreDbSchema);
