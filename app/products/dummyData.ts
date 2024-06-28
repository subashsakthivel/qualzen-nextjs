import { ProdcutStatus } from "@/utils/Enums";
import { ProductDetailsType, ProductType } from "@/utils/VTypes";

export const products: ProductDetailsType[] = [
  {
    _id: "fdgd",
    createdAt: Date.now(),
    likedCount: 2,
    product: {
      _id: "dsggf",
      category: {
        name: "Hat",
        properties: [
          {
            name: "color",
            value: ["yellow", "blue", "black"],
          },
        ],
      },
      description: "Well branded shirt",
      imageUrls: [
        "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
        "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
      ],
      marketPrice: 1000,
      sellingPrice: 888,
      status: ProdcutStatus.ACTIVE,
      name: "red Hat",
    },
    replacedCount: 0,
    soldCount: 0,
    marginPrice: 0,
  },
  {
    _id: "fdgd",
    createdAt: Date.now(),
    likedCount: 2,
    product: {
      _id: "dsggf",
      category: {
        name: "Hat",
        properties: [
          {
            name: "color",
            value: ["yellow", "blue", "black"],
          },
        ],
      },
      description: "Well branded shirt",
      imageUrls: [
        "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
        "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
      ],
      marketPrice: 1000,
      sellingPrice: 888,
      status: ProdcutStatus.DRAFT,
      name: "red Hat",
    },
    replacedCount: 0,
    soldCount: 0,
    marginPrice: 0,
  },
  {
    _id: "fdgd",
    createdAt: Date.now(),
    likedCount: 2,
    product: {
      _id: "dsggf",
      category: {
        name: "Hat",
        properties: [
          {
            name: "color",
            value: ["yellow", "blue", "black"],
          },
        ],
      },
      description: "Well branded shirt",
      imageUrls: [
        "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
        "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg",
      ],
      marketPrice: 1000,
      sellingPrice: 888,
      status: ProdcutStatus.ARCHIVED,
      name: "red Hat",
    },
    replacedCount: 0,
    soldCount: 0,
    marginPrice: 0,
  },
];
