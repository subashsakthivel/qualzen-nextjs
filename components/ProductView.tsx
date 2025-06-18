import ProductView from "@/app/(app)/products/[id]/page";
import { TProduct } from "@/schema/Product";

const product: TProduct = {
  name: "Plontheo",
  category: "543kvfgdfgfkg",
  attributes: [],
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis eius nisi laboriosam esse cum error culpa eligendi voluptatem, aliquam quaerat tempora, iure optio quod, dolorem at nobis vitae deleniti expedita.",
  imageNames: [],
  isActive: true,
  price: 1000,
  sku: "FHY-5",
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductView params={{ id }} />;
}
