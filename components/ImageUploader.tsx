import { RefreshCcwIcon, Upload } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";

interface ImageUploaderProps {
  imageFiles: File[];
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

function ImageUploader({ imageFiles, setImageFiles }: ImageUploaderProps) {
  const onImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFiles([...imageFiles, ...Array.from(event.target.files)]);
    }
  };

  return (
    <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
      <CardHeader className="felx flex-row items-center justify-around">
        <CardTitle>Product Images</CardTitle>
        <RefreshCcwIcon className="size-5 cursor-pointer" onClick={() => setImageFiles([])} />
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {imageFiles && imageFiles.length >= 1 && (
            <div className="grid gap-2">
              <Image
                alt="Product image"
                className="aspect-square w-full rounded-md object-cover"
                height="300"
                width="300"
                src={URL.createObjectURL(imageFiles[0])}
              />
            </div>
          )}

          <div className={`grid grid-flow-* gap-2 ${imageFiles ? "grid-cols-2" : ""}`}>
            {imageFiles &&
              imageFiles.slice(1).map((imageFile, index) => (
                <div key={index} className="relative">
                  <span className="absolute rounded-full border bg-background m-1 size-5 text-center">
                    {index + 2}
                  </span>
                  <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="84"
                    width="84"
                    src={URL.createObjectURL(imageFile)}
                    key={index}
                  />
                </div>
              ))}

            <div className="flex justify-center relative ">
              <label
                className={`w-full min-h-20 bg-secondary text-center border border-dashed flex flex-col items-center cursor-pointer justify-center text-sm  rounded-sm   ${
                  imageFiles ? "relative shadow-lg min-w-20" : "shadow-sm min-h-80"
                }`}
              >
                <Upload className="h-4 w-4 text-muted-foreground" />
                <input
                  type="file"
                  name="ImageSrc"
                  className="hidden"
                  onChange={onImageFileChange}
                  multiple
                  accept="image/png, image/gif, image/jpeg"
                />
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ImageUploader;
