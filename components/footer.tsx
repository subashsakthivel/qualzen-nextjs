import React from "react";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 logo-gradient rounded-lg flex items-center justify-center shadow-lg">
                <Image
                  width={24}
                  height={24}
                  src="/lovable-uploads/9dac5233-cc93-4962-a22d-70263c999a5b.png"
                  alt="VF Logo"
                  className="w-6 h-6 object-contain filter brightness-0 invert"
                />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
                VARFEO
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium fashion clothing brand with bold designs. Express your unique style with
              VARFEO.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/products"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                All Products
              </Link>
              <Link
                href="/offers"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Special Offers
              </Link>
              <Link
                href="/orders"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Track Orders
              </Link>
              <Link href="/help" className="block text-sm text-muted-foreground hover:text-primary">
                Help Center
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <div className="space-y-2">
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Contact Us
              </Link>
              <Link
                href="/about"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                About Us
              </Link>
              <Link href="/help" className="block text-sm text-muted-foreground hover:text-primary">
                FAQ
              </Link>
              <div className="text-sm text-muted-foreground">Returns & Exchanges</div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@varfeo.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Fashion St, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 VARFEO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
