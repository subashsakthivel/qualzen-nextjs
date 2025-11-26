import { TCategory } from "@/schema/Category";
import R2Util from "@/util/S3Util";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CategoryDbSchema = new mongoose.Schema<TCategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: { type: String , required : false },
  description: { type: String, required: false },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  attributes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategorySpecificAttributes",
      default: null,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

CategoryDbSchema.post("find", async function (docs: TCategory[] | null, next) {
  if (docs) {
    docs
      .filter((d) => d.image)
      .map(async (doc) => {
        doc.image = await R2Util.getObjectUrl(doc.image);
      });
  }
  next();
});

CategoryDbSchema.post("findOne", async function (doc: TCategory | null, next) {
  if (doc && doc.image) {
    doc.image = await R2Util.getObjectUrl(doc.image);
  }
  next();
});

CategoryDbSchema.post("deleteOne", async function (doc: TCategory | null, next) {
  if (doc && doc.image) {
    await R2Util.deleteFile(doc.image);
  }
  next();
});
CategoryDbSchema.post("deleteMany", async function (docs: TCategory[] | null, next) {
  if (docs) {
    docs.forEach(async (doc) => {
      if (doc.image) {
        await R2Util.deleteFile(doc.image);
      }
    });
  }
});

CategoryDbSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate()
  console.log(update)
  if (update && !Array.isArray(update) && update.$set && update.$set.image) {
    const doc = await this.model.findOne(this.getQuery())
    if (doc && doc.image) {
      await R2Util.deleteFile(doc.image);
    }
  }
  next();
});


CategoryDbSchema.plugin(mongoosePaginate); //todo: need to remove paginate later

export const CategoryModel =
  (mongoose.models?.Category as unknown as mongoose.PaginateModel<TCategory>) ||
  mongoose.model<TCategory, mongoose.PaginateModel<TCategory>>("Category", CategoryDbSchema);
