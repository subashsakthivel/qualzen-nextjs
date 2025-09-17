import React from "react";
import { redirect } from "next/navigation";

const ProductVariantPage = async ({ params }: { params: Promise<{ id: string; vid: string }> }) => {
  const { id, vid } = await params;
  redirect(`/products/${id}_${vid}`);
};

export default ProductVariantPage;
