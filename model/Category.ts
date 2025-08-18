import { CategorySchema, TCategory } from "@/schema/Category";
import DatabaseUtil from "@/util/dbUtil";
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
  image: { type: String },
  displayName: { type: String, required: false },
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

CategoryDbSchema.pre("save", async function (next) {
  try {
    const product = this;
    if (this.isNew) {
      CategorySchema.parse(product.toObject());
      product._id = await DatabaseUtil.getSeq({ _id: "product" });
    }
    next();
  } catch (err) {
    next(err as Error);
  }
});
CategoryDbSchema.post("save", async function (doc, next) {
  try {
    next();
  } catch (err) {
    await R2Util.deleteFile(doc.image);
    next(err as Error);
  }
});
CategoryDbSchema.post("find", async function (docs: TCategory[] | null, next) {
  if (docs) {
    docs.map(async (doc) => {
      doc.image = await R2Util.getObjectUrl(doc.image);
    });
  }
  next();
});
CategoryDbSchema.post("findOne", async function (doc: TCategory | null, next) {
  if (doc) {
    doc.image = await R2Util.getObjectUrl(doc.image);
  }
  next();
});

CategoryDbSchema.plugin(mongoosePaginate); //todo: need to remove paginate later

export const CategoryModel =
  (mongoose.models?.Category as unknown as mongoose.PaginateModel<TCategory>) ||
  mongoose.model<TCategory, mongoose.PaginateModel<TCategory>>("Category", CategoryDbSchema);
