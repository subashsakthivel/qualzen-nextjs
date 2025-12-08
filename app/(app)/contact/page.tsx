"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Icon } from "lucide-react";
import { FaFacebook, FaGoogle, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import About from "@/components/about";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      title: "Address : (Main Branch)",
      details: "19 , Pichampalayam, Tirupur",
    },
    {
      icon: <Phone className="h-5 w-5 text-primary" />,
      title: "Phone",
      details: "+91 63830 19245 | +91 99737 74859",
    },
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      title: "Email",
      details: "varfeo.support@gmail.com",
    },
  ];

  const socialMedia = [
    {
      name: "Gmail",
      icon: <FaGoogle />,
      href: "https://gmail.com",
    },
    {
      name: "Instagram",
      icon: <FaInstagram />,
      href: "https://instagram.com",
    },
    {
      name: "FaceBook",
      icon: <FaFacebook />,
      href: "https://instagram.com",
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp />,
      href: "https://instagram.com",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground">
            Get in touch with our team. We are here to help with any questions or concerns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      className="w-full min-h-[120px] px-3 py-2 border border-input rounded-md resize-none"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contact through social media</CardTitle>
              </CardHeader>
              <CardContent className="space-x-2 flex justify-center items-center flex-wrap">
                {socialMedia.map((media) => (
                  <div
                    key={media.name}
                    className="flex justify-center items-center border p-5 rounded-sm"
                  >
                    <Link href={media.href} target="_blank">
                      {media.icon}
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                We did love to hear from you. Choose the best way to reach us and we will respond as
                quickly as possible.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{info.icon}</div>
                  <div>
                    <h3 className="font-semibold mb-1">{info.title}</h3>
                    <p className="text-muted-foreground">{info.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <About />
    </div>
  );
};

export default Contact;
