import { z } from "zod";
import { CategoryModel } from "@/model/Category";
import mongoose from "mongoose";
import { UserInfoModel } from "@/model/UserInfo";
import { CategorySchema } from "@/schema/Category";
import { UserInfoSchema } from "@/schema/UserInfo";
import { ProductSchema } from "@/schema/Product";
import { ProductModel } from "@/model/Product";
import { ProductVariantModel } from "@/model/ProductVarient";
import { AddressModel } from "@/model/Address";
import { AddressSchema } from "@/schema/Address";
import { tDataModels } from "@/util/util-type";
import { ContentSchema } from "@/schema/Content";
import { ContentModel } from "@/model/Content";
import { OrderSchema } from "@/schema/Order";
import { OrderModel } from "@/model/Order";
import { ProductGroupSchema } from "@/schema/ProductGroup";
import { ProductGroupModel } from "@/model/ProductGroup";
import { FileStoreSchema } from "@/schema/FileStore";
import { FileStoreModel } from "@/model/FileStore";
import { OfferSchema } from "@/schema/Offer";
import { OfferModel } from "@/model/Offer";


export const ModelSchemaMap: Record<tDataModels, IModelSchema> = {
    category: {
        schema: CategorySchema,
        dbModel: CategoryModel,
        fileObjects: [{ path: "image" }],
    },
    userinfo: {
        schema: UserInfoSchema,
        dbModel: UserInfoModel,
    },
    product: {
        schema: ProductSchema,
        dbModel: ProductModel,
        fileObjects: [{ path: "images" }],
    },
    address: {
        schema: AddressSchema,
        dbModel: AddressModel,
        subdocs: [
            {
                path: "variants",
                dbModel: ProductVariantModel,
            },
        ],
    },
    content: {
        schema: ContentSchema,
        dbModel: ContentModel,
        fileObjects: [{ path: "bgImg.img" }],
    },
    order: {
        schema: OrderSchema,
        dbModel: OrderModel,
    },
    productgroup: {
        schema: ProductGroupSchema,
        dbModel: ProductGroupModel,
    },
    filestore: {
        schema: FileStoreSchema,
        dbModel: FileStoreModel,
    },
    offer: {
        schema: OfferSchema,
        dbModel: OfferModel,
    },
};


export interface IModelSchema {
    schema: z.ZodObject<any>;
    dbModel: mongoose.PaginateModel<any> | mongoose.Model<any>;
    subdocs?: [{ path: string; dbModel: mongoose.PaginateModel<any> | mongoose.Model<any> }];
    fileObjects?: { path: string }[];
}