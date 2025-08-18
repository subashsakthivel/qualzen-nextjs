import { ProductVariantSchema, TProductVariant } from "@/schema/ProductVarient";
import DatabaseUtil from "@/util/dbUtil";
import R2Util from "@/util/S3Util";
import mongoose from "mongoose";

const ProductVariantDBSchema = new mongoose.Schema<TProductVariant>({
  sku: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  sellingPrice: {
    type: Number,
    required: false,
    min: 0,
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  images: {
    type: [String],
    default: [],
    minlength: 1,
  },
  attributes: [
    {
      name: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
      sortOrder: {
        type: Number,
        default: 100,
      },
    },
  ],

  isActive: {
    type: Boolean,
    required: true,
    default: true,
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

ProductVariantDBSchema.pre("save", async function (next) {
  try {
    const product = this;
    if (this.isNew) {
      ProductVariantSchema.parse(product.toObject());
      product._id = await DatabaseUtil.getSeq({ _id: "product" });
    }
    next();
  } catch (err) {
    next(err as Error);
  }
});
ProductVariantDBSchema.post("save", async function (doc, next) {
  try {
    next();
  } catch (err) {
    await R2Util.deleteFiles(doc.images);
    next(err as Error);
  }
});
ProductVariantDBSchema.post("find", async function (docs: TProductVariant[] | null, next) {
  if (docs) {
    docs.map(async (doc) => {
      doc.images = await R2Util.getObjectUrls(doc.images);
    });
  }
  next();
});
ProductVariantDBSchema.post("findOne", async function (doc: TProductVariant | null, next) {
  if (doc) {
    doc.images = await R2Util.getObjectUrls(doc.images);
  }
  next();
});

export const ProductVariantModel =
  (mongoose.models?.ProductVariant as mongoose.Model<TProductVariant>) ||
  mongoose.model<TProductVariant>("ProductVariant", ProductVariantDBSchema);
