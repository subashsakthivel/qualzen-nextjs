import { ProdcutStatus } from "./Enums";

export type BreadCrumType = {
  name: string;
  href: string;
};

export interface IProperty {
  name: string;
  value: string[] | string;
}

export interface CategoryType {
  _id?: string;
  name: string;
  parentCategory?: CategoryType;
  parentCategoryID?: string;
  properties: IProperty[];
}
