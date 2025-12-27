import React from "react";
import { Linkedin } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
const FooterSection = () => {
  return (
    <footer>
      <div className="w-full mx-auto px-5 flex flex-col  gap-8 md:gap-0 py-10 md:py-[70px]">
        {/* Left Section: Logo, Description, Social Links */}
        <div className="flex flex-col justify-center gap-8 p-4 md:p-8">
          <div className="flex gap-3 items-stretch justify-center">
            <div className="text-center text-foreground text-xl md:text-4xl font-semibold leading-4">
              Varfoe
            </div>
          </div>
          <p className="text-foreground/90 text-sm font-medium leading-[18px] text-center">
            Premium fashion clothing brand with bold designs. Express your unique style with VARFEO.
          </p>
          <div className="flex  gap-3  md:gap-8 justify-center items-center">
            <a
              href="#"
              aria-label="GitHub"
              className="w-4 h-4 md:w-10 md:h-10 flex items-center justify-center"
            >
              <FaInstagram className="w-full h-full text-muted-foreground" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-4 h-4 md:w-10 md:h-10 flex items-center justify-center"
            >
              <Linkedin className="w-full h-full text-muted-foreground" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-4 h-4 md:w-10 md:h-10 flex items-center justify-center"
            >
              <FaFacebook className="w-full h-full text-muted-foreground" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-4 h-4 md:w-10 md:h-10 flex items-center justify-center"
            >
              <FaYoutube className="w-full h-full text-muted-foreground" />
            </a>
          </div>
        </div>
        {/* Right Section: Product, Company, Resources */}
        <div className="flex justify-around gap-8 md:gap-12 p-4 md:p-8 w-full md:w-auto">
          <div className="flex flex-col justify-start items-start gap-3">
            <h3 className="text-muted-foreground text-sm font-medium leading-5">Quick Links</h3>
            <div className="flex flex-col justify-end items-start gap-2">
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Products
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                New arraivals
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Best Offers
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                News Letter
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                History
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-3">
            <h3 className="text-muted-foreground text-sm font-medium leading-5">Company</h3>
            <div className="flex flex-col justify-center items-start gap-2">
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                About us
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Our team
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Brand
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Contact
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-3">
            <h3 className="text-muted-foreground text-sm font-medium leading-5">Resources</h3>
            <div className="flex flex-col justify-center items-start gap-2">
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Terms of use
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Shipping Details
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Return Policy
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Join Team
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t-2 w-full text-center p-6 font-thin text-muted-foreground flex justify-between">
        <div className="opacity-50">@2025 varfeo</div>
        <div>LOGO</div>
        <div>cookies setting</div>
      </div>
    </footer>
  );
};

export default FooterSection;
