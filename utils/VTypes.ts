import { ProdcutStatus } from "./Enums";

export type BreadCrumType = {
  name: string;
  href: string;
};

export type PropertyType = {
  name: string;
  value: string | string[];
};

export interface ProductType {
  _id: string;
  name: string;
  imageUrls: string[];
  description: string;
  category: CategoryType;
  marketPrice: number;
  sellingPrice: number;
  status: ProdcutStatus;
}

export interface ProductDetailsType {
  _id: string;
  product: ProductType;
  createdAt: number;
  expiryDate?: number;
  marginPrice?: number;
  soldCount: number | 0;
  replacedCount: number | 0;
  likedCount: number | 0;
}

export interface CategoryType {
  _id?: string;
  name: string;
  parentCategory?: CategoryType;
  parentCategoryID?: string;
  properties: PropertyType[];
}
