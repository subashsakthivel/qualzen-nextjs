import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";

interface SimpleCardInterface {
  image?: string | string[];
  redirectLink: string;
  name: string;
  description: string;
  className?: string;
}
function SimpleCard({ image, name, className, redirectLink }: SimpleCardInterface) {
  return (
    <Link href={"/product-gallery" + redirectLink}>
      <Card className={"overflow-hidden h-[20vh] w-full cursor-pointer cursor-auto" + className}>
        <CardContent className="relative p-0 h-full w-full">
          {image && (
            <div className="absolute inset-0">
              <Image
                src={Array.isArray(image) ? image[0] : image}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          )}
          <CardFooter className="absolute bottom-0 left-0 w-full">
            <div className="text-left text-sm bg-black/30 p-2">
              <div className="text-white">{name}</div>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </Link>
  );
}

export default SimpleCard;
