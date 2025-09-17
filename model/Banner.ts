import { tBanner } from "@/schema/Banner";
import mongoose, { Schema, Types } from "mongoose";
const BannerSchema = new mongoose.Schema<tBanner>({
  title: {
    type: Schema.Types.String,
    require: true,
  },
  title_link: {
    type: Schema.Types.String,
  },
  style: Schema.Types.String,
  unique_grp_key: {
    type: Schema.Types.String,
    require: true,
  },
  type: Schema.Types.String,
  custom_component: new Schema(
    {
      style: Schema.Types.String,
      component: Schema.Types.String,
    },
    { _id: false }
  ),
  background_img: Schema.Types.String,
  backgroud_link: Schema.Types.String,
  content_componenets: new Schema({
    name: Schema.Types.String,
    description: Schema.Types.String,
    image: Schema.Types.String,
    redirect_link: Schema.Types.String,
    style: Schema.Types.String,
    component: Schema.Types.String,
  }),
});

export const BannerModel =
  (mongoose.models?.BannerModel as mongoose.Model<tBanner>) ||
  mongoose.model<tBanner, mongoose.Model<tBanner>>("BannerSchema", BannerSchema);
