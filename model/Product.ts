import mongoose from "mongoose";
import { ProductSchema, TProduct } from "@/schema/Product";
import mongoosePaginate from "mongoose-paginate-v2";
import { ProductVariantModel } from "./ProductVarient";
import DatabaseUtil from "@/util/dbUtil";
import R2Util from "@/util/S3Util";

const ProductDBSchema = new mongoose.Schema<TProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  sku: {
    type: String,
    required: false,
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
    default: 0,
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
  variants: [ProductVariantModel],
  tags: {
    type: [String],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  instructions: {
    type: String,
  },
  otherdetails: {
    type: String,
  },
  relatedLinks: {
    type: [String],
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

ProductDBSchema.pre("save", async function (next) {
  try {
    const product = this;
    if (this.isNew) {
      ProductSchema.parse(product.toObject());
      product._id = await DatabaseUtil.getSeq({ _id: "product" });
    }
    next();
  } catch (err) {
    next(err as Error);
  }
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
      doc.images = await R2Util.getObjectUrls(doc.images);
    });
  }
  next();
});
ProductDBSchema.post("findOne", async function (doc: TProduct | null, next) {
  if (doc) {
    doc.images = await R2Util.getObjectUrls(doc.images);
  }
  next();
});

ProductDBSchema.plugin(mongoosePaginate); //todo: need to remove paginate later

export const ProductModel =
  (mongoose.models?.Product as unknown as mongoose.PaginateModel<TProduct>) ||
  mongoose.model<TProduct, mongoose.PaginateModel<TProduct>>("Product", ProductDBSchema);
