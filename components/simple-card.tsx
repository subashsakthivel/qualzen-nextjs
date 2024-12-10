import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Image from "next/image";

interface SimpleCardInterface {
  image?: string;
  redirectLink: string;
  name: string;
  description: string;
}
function SimpleCard({ image, redirectLink, name, description }: SimpleCardInterface) {
  return (
    <Card className="overflow-hidden w-[20vh] md:w-[25vh] h-[20vh] md:h-[25vh]">
      <CardContent className="relative h-full p-0">
        {image && (
          <div className="absolute inset-0">
            <Image src={image} alt={name} fill className="object-cover" />
          </div>
        )}
        <CardFooter className="">
          <div className="text-left absolute left-0 bottom-0 text-sm bg-black/30 w-full">
            <div className="text-white ml-2">{name}</div>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

export default SimpleCard;
