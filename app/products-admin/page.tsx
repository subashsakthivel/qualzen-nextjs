import React from "react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import Link from "next/link";
async function getProducts(page: number = 0, limit: number = 10) {
  const res = await fetch(
    `/api/products?operation=fetchWithPaginationAndTotal&pageIndex=${page}&pageLimit=${limit}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}
const Products = async () => {
  const page = 1;
  const limit = 10;
  const products = await getProducts(page, limit);
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>New Arrivals</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Create new product which in available in store or in production
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href={"/form/product"}>
                <Button className="mr-3"> New Product</Button>
              </Link>
              <Link href={"/form/category"}>
                <Button>New Category</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        <DataTable columns={columns} data={products} />
      </div>
    </main>
  );
};

export default Products;
