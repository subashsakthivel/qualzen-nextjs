"use client";
import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BreadCrumType } from "@/lib/VTypes";
import { usePathname } from "next/navigation";

const BreadCrums = () => {
  const pathname = usePathname();
  const pathArray = pathname.split("/").filter((part) => part.length > 0);

  const breadcrumbs: BreadCrumType[] = pathArray.map((part, index) => {
    const href = "/" + pathArray.slice(0, index + 1).join("/");
    const name = part.replace(/-/g, " ");
    return { href, name };
  });

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbs.length > 0 &&
          breadcrumbs.map((breadCrum, index) => (
            <>
              {index !== BreadCrums.length - 1 ? (
                <>
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink asChild>
                      <Link href={breadCrum.href}>{breadCrum.name}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadCrum.name}</BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrums;