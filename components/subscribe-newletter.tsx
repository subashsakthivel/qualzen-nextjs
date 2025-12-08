import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FaWhatsapp } from "react-icons/fa";

const SubscribeNewsLetter = () => {
  return (
    <div className="flex flex-col space-y-6 justify-center items-center text-3xl w-full">
      <div className="flex gap-5 items-center justify-center">
        <h1 className="font-extrabold">Join </h1>
      </div>
      <div className="flex gap-2 items-center justify-center underline">
        <FaWhatsapp className="text-green-500 hover:scale-105 hover:cursor-pointer" />
        <h6 className="text-2xl">WHATSAPP CHANNEL</h6>
      </div>
      <div className="flex gap-10 md:min-w-96">
        <Input placeholder="Enter email" type="email" />
        <Button>Submit</Button>
      </div>
    </div>
  );
};

export default SubscribeNewsLetter;
