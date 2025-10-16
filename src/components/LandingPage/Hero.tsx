import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import GradientBlinds from "../ReactBits/GradientBlinds/GradientBlinds";

const Hero = () => {
  return (
    <div
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center relative px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Gradient Blinds Background - Only for Hero */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
        <GradientBlinds
          gradientColors={["#FF9FFC", "#5227FF"]}
          angle={20}
          noise={0.5}
          blindCount={16}
          blindMinWidth={60}
          spotlightRadius={0.5}
          spotlightSoftness={1}
          spotlightOpacity={1}
          mouseDampening={0.15}
          distortAmount={0}
          shineDirection="left"
          mixBlendMode="lighten"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full pointer-events-none">
        {/* Content with enhanced visibility over gradient blinds */}
        <div className="relative z-20 flex flex-col items-center justify-center max-w-7xl mx-auto w-full">
          {/* Background overlay for better text readability */}

          <div className="relative z-10 p-4 sm:p-12">
            <h1 className="gradient-text font-roboto text-center drop-shadow-lg">
              Aligning Your Ideas <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              Across Every Axis
            </h1>

            <p className="hero-text font-roboto text-center max-w-4xl mx-auto drop-shadow-md">
              At sumbu labs, we align <span className="highlight">vision</span>,{" "}
              <span className="highlight">technology</span>, and{" "}
              <span className="highlight">execution</span> on the same plane.
            </p>

            <div className="div-button flex sm:flex-row items-center justify-center gap-0 mt-8 sm:mt-12 cursor-pointer pointer-events-auto">
              <button
                onClick={() => {
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-cta w-full sm:w-auto shadow-lg"
              >
                View our services
              </button>
              <button className="btn-cta-2 sm:ml-[-10px] shadow-lg">
                <MdKeyboardArrowDown
                  size={36}
                  className="sm:text-[36px] text-[28px]"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

