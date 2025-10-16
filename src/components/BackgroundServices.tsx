import React from "react";
import MetaBalls from "./ReactBits/MetaBalls/MetaBalls";

const BackgroundServices = () => {
  return (
    <div>
      <MetaBalls
        color="#ffffff"
        cursorBallColor="#ffffff"
        cursorBallSize={2}
        ballCount={15}
        animationSize={30}
        enableMouseInteraction={true}
        enableTransparency={true}
        hoverSmoothness={0.05}
        clumpFactor={1}
        speed={0.3}
      />
    </div>
  );
};

export default BackgroundServices;

