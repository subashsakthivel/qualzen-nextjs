import React from "react";
import ProductShowcase from "@/components/productShowcase";
import DataAPI from "@/data/data-api";
import { TProduct } from "@/schema/Product";
import { TProductInfo } from "@/components/cart-provider";

export default async function ProductView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const producId = id.includes("_") ? id.split("_")[0] : id;
  const product = await DataAPI.getData({
    modelName: "product",
    operation: "GET_DATA_BY_ID",
    request: { id: producId, options: { lean: true } },
  }).then((res) => JSON.parse(JSON.stringify(res)));

  if (!product) {
    return <>Not Available</>;
  }

  function processProduct(product: TProduct, id: string) {
    const ids = id.split("_");
    const variantId = ids.length > 1 ? ids[1] : undefined;
    const vAttributes: TProductInfo["varaintAttributes"] = new Map();
    let productInfo = { ...product } as TProductInfo;
    if (variantId) {
      const variant = product.variants.find((v) => v._id === variantId);
      if (variant) {
        productInfo.selectedVaraint = variant;
      }
    }
    if (product.variants.length > 0) {
      product.variants.map((v) => {
        v.attributes.map((vAttr) => {
          if (vAttr.value && vAttr.value.length === 0) return;
          if (!vAttributes.has(vAttr.name))
            vAttributes.set(vAttr.name, {
              name: vAttr.name,
              values: new Set(),
              sortOrder: vAttr.sortOrder,
              id: v._id!,
            });
          vAttributes.get(vAttr.name)?.values.add(vAttr.value);
        });
      });
      productInfo.varaintAttributes = vAttributes;
      productInfo.attributes = product.attributes.filter(
        (attr) => attr.value && attr.value.length > 0
      );
    }
    return productInfo;
  }

  return <ProductShowcase product={processProduct(product, id)} />;
}
