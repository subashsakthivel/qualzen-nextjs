import dbConnect from "@/lib/mongoose";
import { Category, ICategory } from "@/model/Category";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "../upload/route";
import { IProperty } from "@/utils/VTypes";

export async function GET(request: NextRequest) {
  await dbConnect();

  const params = request.nextUrl.searchParams;

  const pageIndex: number = parseInt(params.get("pageIndex") ?? "1");
  const pageLimit: number = parseInt(params.get("pageLimit") ?? "10");

  console.log("mage request");
  try {
    //if (page !== undefined && pageSize !== undefined) {
    // const categories = await Category.aggregate([
    //   {
    //     $facet: {
    //       metadata: [{ $count: "totalCount" }],
    //       data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
    //     },
    //   },
    // ]);

    // const resData = await getPaginationData<ICategory>(
    //   Category,
    //   page,
    //   pageSize
    // );
    return NextResponse.json({ message: "allgood", data: [] }, { status: 200 });
    //} else {
    //return NextResponse.json({ message: "invalid request" }, { status: 403 });
    //}
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  const form = await request.formData();
  try {
    const name = form.get("name") as string;
    const imageSrc = form.getAll("imageSrc") as File[];
    const description = form.get("description") as string;

    const properties = JSON.parse(
      form.get("properties") as string
    ) as IProperty[];

    const parentCategory = JSON.parse(
      form.get("parentCategory") as string
    ) as ICategory;

    console.log("---CATEGORY POST---");
    console.log(name, properties, imageSrc, description);
    await uploadImage(imageSrc).then(async (imageSrc) => {
      if (imageSrc === undefined || !imageSrc[0]) {
        NextResponse.json({ message: "Image Upload failed" }, { status: 500 });
        return;
      }

      const category: ICategory = {
        name,
        description,
        properties,
        imageSrc: imageSrc[0],
        parentCategory,
      };

      await Category.create(category).then((res) => {
        console.log("Category Created Response : ", res);
        NextResponse.json(
          { message: "New Category created", response: res },
          { status: 200 }
        );
      });
    });
  } catch (err) {
    console.log("Error Occured while creating new Categgory ", err);
    return NextResponse.json(
      { message: "New Category Not created" },
      { status: 400 }
    );
  }
}
