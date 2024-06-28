"use client";
import { ProductDetailsType, ProductType } from "@/utils/VTypes";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";
import Image from "next/image";
import { ProdcutStatus } from "@/utils/Enums";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<ProductDetailsType>[] = [
  {
    accessorKey: "product",
    header: () => <span className="sr-only">Image</span>,
    cell: ({ row }) => {
      const product: ProductType = row.getValue("product");
      const url = product.imageUrls[0];

      return (
        <Image
          alt="Product image"
          className="hidden sm:block aspect-square rounded-md object-cover "
          height="64"
          src={url}
          width="64"
        />
      );
    },
  },
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const product: ProductType = row.getValue("product");
      const name = product.name;

      return <span>{name}</span>;
    },
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const product: ProductType = row.getValue("product");
      const status = product.status;
      return (
        <Badge
          variant={
            ProdcutStatus.ARCHIVED === status
              ? "secondary"
              : ProdcutStatus.DRAFT === status
              ? "outline"
              : "default"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "sellingPrice",
    header: () => <span className="hidden sm:block">Price</span>,
    cell: ({ row }) => {
      const product: ProductType = row.getValue("product");
      const sellingPrice = product.sellingPrice;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(sellingPrice);
      return <span className="hidden sm:block">{formatted}</span>;
    },
  },
  {
    accessorKey: "soldCount",
    header: "Total Sales",
  },
  {
    accessorKey: "actions",
    header: () => <span></span>,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
