import React from "react";
import MagicBento from "../ReactBits/MagicBento/MagicBento";
import MetaBalls from "../ReactBits/MetaBalls/MetaBalls";

const Services = () => {
  return (
    <div
      id="services"
      className="w-full flex flex-col min-h-screen relative mt-20"
    >
      <h1 className="services px-0 lg:px-32 z-[1000] text-center lg:text-left flex items-center justify-center lg:justify-start">
        Our Services
      </h1>
      {/* MetaBalls Background - Top Right */}
      <div className="absolute top-[-80px] right-[0px] w-[500px] h-[500px] z-2">
        <MetaBalls
          color="#ffffff"
          cursorBallColor="#ffffff"
          cursorBallSize={2}
          ballCount={25}
          animationSize={30}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.15}
          clumpFactor={1.1}
          speed={0.4}
        />
      </div>
      {/* MetaBalls Background - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-96 h-96  z-0">
        <MetaBalls
          color="#ffffff"
          cursorBallColor="#ffffff"
          cursorBallSize={2}
          ballCount={25}
          animationSize={30}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.15}
          clumpFactor={1.1}
          speed={0.4}
        />
      </div>
      {/* Main Content */}
      <div className="relative z-10 w-full">
        <MagicBento
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={300}
          particleCount={12}
          glowColor="132, 0, 255"
        />
      </div>
    </div>
  );
};

export default Services;
