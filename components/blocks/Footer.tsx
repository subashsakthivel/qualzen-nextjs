import React from "react";
import SocialConnect from "./SocialConnect";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-primary text-secondary m-0 mt-5  bottom-0">
      <div className="  flex flex-wrap font-light justify-around md:justify-between sm:items-center -z-20 m-3">
        <div className="text-center md:text-start font-extralight space-y-1 m-2">
          <div className="cursor-pointer ">SHOP</div>
          <Link className="cursor-pointer " href={"/store/aboutUS"}>
            ABOUT US
          </Link>
          <div className="cursor-pointer ">SHIPPING POLICY</div>
          <div className="cursor-pointer">RETURN/REFUND POLICY</div>
          <div className="cursor-pointer ">PRIVACY POLICY</div>
          <div className="cursor-pointer ">TERMS & CONDITIONS</div>
        </div>
        <div className="flex gap-5 overflow-auto m-2 ">
          <div className="space-y-3">
            <div className="text-center text-xl">FASHION</div>
            <div className="m-3 font-extralight ">Increase positive atoms with our fashion</div>
            <SocialConnect className="gap-5" />
          </div>
        </div>
        <div className=" p-5 m-2 ">
          <div className="text-center text-xl">Email</div>
          <div className="border-b-2" typeof="email">
            support@qualzen.in
          </div>
        </div>
        <div className="text-start p-5 m-2 ">
          <div className="text-center text-xl ">Address</div>
          <div className="text-wrap text-start">
            123,<br></br>JIMJOM,<br></br>GOA,<br></br>TIJ-67803
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
