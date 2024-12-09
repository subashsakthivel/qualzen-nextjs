import { getDateFormet } from "@/utils/formetUtil";
import Image from "next/image";
import React from "react";

const FeatureTrends = () => {
  return (
    <div className="grid gap-3 grid-cols-2 place-items-center items-center justify-center  ">
      <div className="lg:text-4xl  min-w-full text-2xl text-wrap  relative col-span-2 text-center bg-gradient-to-r from-slate-300 to-slate-500">
        Trend with QualZen
      </div>
      <div>
        <Image
          src={
            "https://qualzen-store.s3.ap-south-1.amazonaws.com/1716401287152.jpg"
          }
          width={180}
          height={180}
          alt="ckd"
          className=" lg:w-[400px] w-[160px] md:w-[300px] rounded-md shadow-2xl border-2 border-primary border-r-8 border-b-8 "
        />
      </div>

      <div className="relative">
        <div className="border m-5 min-h-20 md:min-h-40 rounded-lg relative text-xs md:text-base">
          <div className="bg-primary text-secondary font-semibold p-1 rounded-t-lg">
            QualZen
          </div>
          <div className=" m-3 mb-8">
            Thanks for spreding positivity with us
          </div>
          <div className="bottom-0 right-0 m-2 absolute text-xs opacity-50">
            {getDateFormet(Date.now())}
          </div>
        </div>
        <div className="lg:text-6xl text-2xl  font-thin hidden md:block min-w-96 left-0">
          <span>Use</span>
          <div className=" bg-primary text-secondary skew-x-12 ml-1 underline px-1 transform-gpu">
            #LoveToQualZen
          </div>
        </div>
      </div>
      <div className="sm:hidden lg:text-6xl text-2xl relative font-thin">
        <span>Use</span>
        <span className=" bg-primary text-secondary  skew-x-12  absolute ml-1 underline px-1 ">
          #LoveToQualZen
        </span>
      </div>
    </div>
  );
};

export default FeatureTrends;
