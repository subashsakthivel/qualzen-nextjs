import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
export function HeroSection() {
  return (
    <>
      <Carousel className="absolute h-screen w-screen top-0 ">
        <CarouselContent className="h-full">
          <CarouselItem>
            <Card>
              <CardContent>
                <Image
                  src={"https://i.pinimg.com/1200x/78/93/4f/78934fc7f30fc1e3a3ea54cd14f46041.jpg"}
                  alt="tss"
                  fill
                  className="object-cover"
                />
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card>
              <CardContent>
                <Image
                  src={"https://i.pinimg.com/1200x/c4/12/5b/c4125b07e10568a098c937705337a544.jpg"}
                  alt="tss"
                  fill
                  className="object-cover"
                />
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card>
              <CardContent>
                <Image
                  src={"https://i.pinimg.com/1200x/8b/29/6c/8b296c7735232fa1cbc69e415ac7c25b.jpg"}
                  alt="tss"
                  fill
                  className="object-cover"
                />
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <div className="absolute">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga est, labore voluptas nam
          dignissimos, repellat voluptatibus facilis vel alias odio recusandae adipisci, ducimus
          deleniti incidunt veniam molestias? Laboriosam, sunt totam?
        </div>
        <CarouselPrevious className="absolute bg-black top-8 left-10" />
        <CarouselNext className="absolute bg-black" />
      </Carousel>
      <div className="min-h-screen"></div>
    </>
  );
}
