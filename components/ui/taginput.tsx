"use client";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface TagType {
  label: string;
}

export interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onTagValueChange: (tasg: string[]) => void;
  defaulttags: string[];
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ className, type, defaulttags, onTagValueChange, ...props }, ref) => {
    const [tags, setTags] = React.useState<string[]>(defaulttags);
    const [tag, setTag] = React.useState<string>("");

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "," || e.key === "Enter" || e.keyCode === 13) {
        if (tag.length && tag !== " " && tag !== "," && !tags.includes(tag)) {
          setTags((t) => [...t, tag]);
          onTagValueChange([...tags, tag]);
        }
        setTimeout(() => {
          setTag("");
        }, 0);

        e.code;
      }
    }

    return (
      <div className="flex flex-wrap max-w-full  rounded-md border p-10  bg-background px-3 py-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="break-all flex-wrap flex whitespace-pre-wrap text-wrap w-fit  rounded bg-secondary shadow-md border m-1 hover:shadow-lg"
          >
            <span className="m-1">{tag}</span>
            <span
              className="cursor-pointer font-bold p-0  m-1 rounded-full "
              onClick={() => setTags(tags.filter((t, i) => i !== index))}
            >
              {"  "}
              &times;{"  "}
            </span>
          </div>
        ))}
        <input
          type={type}
          className={cn(
            "text-sm min-w-14 w-full focus:outline-none flex-1 bg-transparent px-1",
            className
          )}
          value={tag}
          ref={ref}
          {...props}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }
);
TagInput.displayName = "Input";

export default TagInput;
