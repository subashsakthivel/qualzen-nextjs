"use client";
import React, { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const newsItems = [
  "🔥 FLASH SALE: 50% off all winter collections ending today!",
  "🎉 100K+ customers joined VARFEO family this month!",
  "✨ New arrivals: Premium leather collection now available",
  "🚀 Free shipping worldwide on orders over $200",
  "💎 VIP members get early access to exclusive drops",
];
import Image from "next/image";
import Link from "next/link";
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemsCount = 0; // This would come from cart context
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scroll down: hide navbar
        setIsVisible(false);
      } else {
        // Scroll up: show navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/contact", label: "Contact" },
    { to: "/help", label: "Help" },
  ];

  return (
    <header
      className={
        "sticky z-50 w-full " +
        (lastScrollY > 200 ? "bg-primary-foreground" : "bg-transparent border-none text-lg") +
        " " +
        (isVisible ? "top-0" : "-top-28") +
        " ease-out duration-100"
      }
    >
      <section
        className={
          "bg-primary text-white py-2 overflow-hidden " + (lastScrollY == 0 ? "block" : "hidden")
        }
      >
        <div className="whitespace-nowrap">
          <div className="news-ticker w-full flex justify-around">
            {newsItems.map((news, index) => (
              <span key={index} className="inline-block mx-8 text-lg font-thin">
                {news}
              </span>
            ))}
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
              <Image
                src={"/next.svg"}
                fill
                alt="VF Logo"
                className="w-6 h-6 object-contain filter brightness-0 invert"
              />
            </div>
            <span className="font-bold text-2xl">VARFEO</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className="text-sm font-medium transition-colors hover:text-primary text-shadow-lg [text-stroke:1px_white]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-4 w-4" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-primary-foreground">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center space-x-4 px-3 py-2">
                <Link href="/signin">
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/cart">
                  <Button variant="ghost" size="icon">
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
