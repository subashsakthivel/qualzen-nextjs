import mongoose from "mongoose";
import { TProduct } from "@/schema/Product";
import mongoosePaginate from "mongoose-paginate-v2";
import { ProductVariantModel } from "./ProductVarient";
import R2Util from "@/util/S3Util";

const ProductDBSchema = new mongoose.Schema<TProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  description: {
    type: String,
    required: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  brand: {
    type: String,
    required: false,
  },
  images: {
    type: [String],
    default: [],
  },
  attributes: [
    {
      name: {
        type: String,
        required: true,
        index: true,
      },
      value: {
        type: String,
        required: true,
        index: true,
      },
      sortOrder: {
        type: Number,
        default: 100,
      },
    },
  ],
  variants: [ProductVariantModel.schema],
  tags: {
    type: [String],
    default: [],
  },
  otherdetails: {
    type: String,
  },
  relatedLinks: {
    type: [{ name: String, url: String }],
    default: [],
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

ProductDBSchema.post("save", async function (doc, next) {
  try {
    next();
  } catch (err) {
    await R2Util.deleteFiles(doc.images);
    next(err as Error);
  }
});

ProductDBSchema.post("find", async function (docs: TProduct[] | null, next) {
  if (docs) {
    docs.map(async (doc) => {
      doc.images =
        doc.images && doc.images.length > 0 ? await R2Util.getObjectUrls(doc.images) : [];
      doc.variants?.forEach(async (variant) => {
        variant.images =
          variant.images && variant.images.length ? await R2Util.getObjectUrls(variant.images) : [];
      });
    });
  }
  next();
});
ProductDBSchema.post("findOne", async function (doc: TProduct | null, next) {
  if (doc) {
    doc.images = doc.images && doc.images.length > 0 ? await R2Util.getObjectUrls(doc.images) : [];
    doc.variants?.forEach(async (variant) => {
      variant.images =
        variant.images && variant.images.length ? await R2Util.getObjectUrls(variant.images) : [];
    });
  }
  next();
});
ProductDBSchema.post("deleteOne", async function (doc: TProduct | null, next) {
  if (doc && doc.images) {
    await R2Util.deleteFiles(doc.images);
    doc.variants.forEach(async (variant) => {
      if (variant.images) {
        await R2Util.deleteFiles(variant.images);
      }
    });
  }
});
ProductDBSchema.post("deleteMany", async function (docs: TProduct[] | null, next) {
  if (docs) {
    docs.forEach(async (doc) => {
      if (doc.images) {
        await R2Util.deleteFiles(doc.images);
      }
      doc.variants.forEach(async (variant) => {
        if (variant.images) {
          await R2Util.deleteFiles(variant.images);
        }
      });
    });
  }
});
ProductDBSchema.plugin(mongoosePaginate); //todo: need to remove paginate later

export const ProductModel =
  (mongoose.models?.Product as unknown as mongoose.PaginateModel<TProduct>) ||
  mongoose.model<TProduct, mongoose.PaginateModel<TProduct>>("Product", ProductDBSchema);
