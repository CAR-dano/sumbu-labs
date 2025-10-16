import React from "react";
import Lanyard, { FiveLanyards } from "../ReactBits/Lanyard/Lanyard";
import RollingGallery from "../ReactBits/RollingGallery/RollingGallery";
import { AppleCardsCarouselDemo } from "../Carousel";

const Team = () => {
  return (
    <div
      id="team"
      className="w-full flex flex-col h-auto relative mt-20 mb-20 md:mb-0"
    >
      <h1 className="services2 px-0 lg:px-32 z-[1000] text-center lg:text-left flex items-center justify-center lg:justify-start ">
        Meet Our Team
      </h1>

      <div className="w-full h-screen mt-5 md:block hidden">
        <div className="relative">
          {/* Hanger dengan baut penggantung */}
          <div className="hanger w-full h-[20px] bg-[#6750A4] relative">
            {/* <div className="absolute left-[13%] top-[-5px] w-8 h-8 bg-white rounded-full shadow-md"></div>
            <div className="absolute left-[31%] top-[-5px] w-8 h-8 bg-white rounded-full shadow-md"></div>
            <div className="absolute left-[49%] top-[-5px] w-8 h-8 bg-white rounded-full shadow-md"></div>
            <div className="absolute left-[67%] top-[-5px] w-8 h-8 bg-white rounded-full shadow-md"></div>
            <div className="absolute left-[84.5%] top-[-5px] w-8 h-8 bg-white rounded-full shadow-md"></div> */}
          </div>

          <FiveLanyards />

          <p className="try-text">Try dragging us around :)</p>
        </div>
      </div>

      <div className="w-full h-auto md:hidden block">
        <AppleCardsCarouselDemo />
      </div>
    </div>
  );
};

export default Team;

