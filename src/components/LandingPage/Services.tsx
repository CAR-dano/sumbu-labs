import React from "react";
import MagicBento from "../ReactBits/MagicBento/MagicBento";

const Services = () => {
  return (
    <div className="w-full px-32 flex flex-col ">
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
  );
};

export default Services;
