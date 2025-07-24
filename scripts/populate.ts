import dbConnect from "../lib/mongoose";
import { heroSectionContent } from "./content-model";
import { ContentModel } from "../model/Content";
import { Model } from "mongoose";

export const populateData = async (data: any, schema: Model<any>) => {
  await dbConnect();
  try {
    await schema.insertMany(data);
    console.log("Data populated successfully.");
    return "Data populated successfully.";
  } catch (error) {
    console.error("Error populating data:", error);
  }
  return "Error populating data.";
};
