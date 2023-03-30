import React from "react";
import banner_bg from "../../assets/banner_bg.png";
import doubleC from "../../assets/CC.png";

const Banner = () => {
    return (
        <div className="container">
            <div className="flex justify-center items-center w-screen">
                <div className="relative -z-10 overflow-hidden">
                    <img
                        src={banner_bg}
                        alt="Banner"
                        className="w-screen h-[420px] sm:h-[480px] md:h-[480px] object-cover"
                    />
                    <div className="absolute inset-0 flex items-center overflow-hidden justify-center">
                        <div className="max-w-lg mx-auto rounded-lg overflow-hidden">
                            <div className="px-6 py-4">
                                <div className="font-bold text-5xl text-white mb-2 text-gray-800 text-center">
                                    Connecting Talent To &nbsp;
                                    <span
                                        className={`relative top-[10px] overflow-hidden inline-block tracking-wider underline decoration-[5px] decoration-[#d957d5] h-[50px] w-0 max-w-fit my-0 mx-auto border-r-[0.15em] border-solid border-white animate-type`}
                                    >
                                    Opportunity
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:right-0 md:w-1/2 -mt-[22px] h-[calc(100%+44px)] opacity-60 flex justify-center items-center absolute top-0 -right-10">
                        <img
                            src={doubleC}
                            className="h-full w-auto mr-n10 object-cover"
                            alt="CC Logo"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;