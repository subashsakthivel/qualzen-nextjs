"use client";

import type React from "react";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Link, Code } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

const formSchema = z.object({
  fromDate: z.date({
    required_error: "From date is required",
  }),
  endDate: z
    .date({
      required_error: "End date is required",
    })
    .refine((date) => date > new Date(), {
      message: "End date must be in the future",
    }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  image: z.instanceof(File).optional(),
  backgroundUrl: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  place: z.string().min(2, {
    message: "Place must be at least 2 characters.",
  }),
  urlLocation: z.string().url({
    message: "Please enter a valid URL.",
  }),
  customHtml: z.string().optional(),
});

export default function AdvancedForm() {
  const [activeTab, setActiveTab] = useState("form");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      backgroundUrl: "",
      location: "",
      place: "",
      urlLocation: "",
      customHtml: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send the data to your backend
    alert("Form submitted successfully!");
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomHtmlButton = () => {
    setShowIframe(true);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="form">Form</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="form" className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>From Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter content text"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel>Upload Image</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="flex-1"
                    />
                    {imagePreview && (
                      <div className="w-16 h-16 relative overflow-hidden rounded-md">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="backgroundUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background URL</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input placeholder="https://example.com/background.jpg" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input placeholder="Enter location" {...field} className="flex-1" />
                        <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-r-md">
                          <MapPin className="h-4 w-4" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input placeholder="Enter place" {...field} className="flex-1" />
                        <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-r-md">
                          <MapPin className="h-4 w-4" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="urlLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Location</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input placeholder="https://example.com" {...field} className="flex-1" />
                      <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-r-md">
                        <Link className="h-4 w-4" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customHtml"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom HTML</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Enter custom HTML code"
                        className="min-h-[150px] font-mono text-sm"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCustomHtmlButton}
                        className="flex items-center gap-2"
                      >
                        <Code className="h-4 w-4" />
                        Custom Advanced
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter custom HTML code that will be displayed in an iframe when the button is
                    clicked.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showIframe && form.getValues("customHtml") && (
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">HTML Preview</h3>
                <div className="bg-muted rounded-md overflow-hidden">
                  <iframe
                    srcDoc={form.getValues("customHtml")}
                    title="Custom HTML Preview"
                    className="w-full h-[300px] border-0"
                    sandbox="allow-scripts"
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full">
              Submit Form
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="preview" className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">From Date</h3>
                  <p>
                    {form.getValues("fromDate")
                      ? format(form.getValues("fromDate"), "PPP")
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                  <p>
                    {form.getValues("endDate")
                      ? format(form.getValues("endDate"), "PPP")
                      : "Not set"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                <p className="text-xl font-semibold">
                  {form.getValues("title") || "No title provided"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Content</h3>
                <p className="whitespace-pre-line">
                  {form.getValues("content") || "No content provided"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Image</h3>
                  {imagePreview ? (
                    <div className="mt-2 rounded-md overflow-hidden border">
                      <Image
                        width={300}
                        src={imagePreview || "/placeholder.svg"}
                        alt="Uploaded"
                        className="max-h-[200px] w-auto"
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No image uploaded</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Background</h3>
                  {form.getValues("backgroundUrl") ? (
                    <div className="mt-2 rounded-md overflow-hidden border">
                      <Image
                        width={300}
                        src={form.getValues("backgroundUrl") || "/placeholder.svg"}
                        alt="Background"
                        className="max-h-[200px] w-auto"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=200&width=300";
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No background URL provided</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <p className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {form.getValues("location") || "Not specified"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Place</h3>
                  <p className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {form.getValues("place") || "Not specified"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">URL Location</h3>
                <p className="flex items-center gap-1">
                  <Link className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={form.getValues("urlLocation")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {form.getValues("urlLocation") || "Not specified"}
                  </a>
                </p>
              </div>

              {showIframe && form.getValues("customHtml") && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Custom HTML</h3>
                  <div className="mt-2 bg-muted rounded-md overflow-hidden">
                    <iframe
                      srcDoc={form.getValues("customHtml")}
                      title="Custom HTML Preview"
                      className="w-full h-[300px] border-0"
                      sandbox="allow-scripts"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
