import React from "react";
import banner_bg from "../../assets/banner_bg.png";
import doubleC from "../../assets/CC.png";

const Banner = () => {
  return (
    <div className="container">
      <div className="flex justify-center items-center w-screen">
        <div className="relative">
          <img
            src={banner_bg}
            alt="Banner"
            className="w-screen h-[420px] sm:h-[480px] md:h-[480px] object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-lg mx-auto rounded-lg overflow-hidden">
              <div className="px-6 py-4">
                <div className="font-bold text-5xl text-white mb-2 text-gray-800 text-center">
                  Connecting Talent To &nbsp;
                  <span
                    className={`overflow-hidden inline-block tracking-wider underline decoration-[5px] decoration-[#d957d5] h-[50px] w-0 max-w-fit my-0 mx-auto border-r-[0.15em] border-solid border-white animate-type`} 
                  >
                    Opportunity
                  </span>
                </div>
              </div>
            </div>
          </div>
          <img
            src={doubleC}
            className="absolute top-0 right-[10px] w-1/4 h-full opacity-70"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
