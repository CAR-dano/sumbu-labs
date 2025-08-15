import React from "react";
import Cubes from "./ReactBits/Cubes/Cubes";

const Background = () => {
  return (
    <div className="absolute inset-0 flex-1 flex items-center justify-center top-0 left-0 z-10 pointer-events-auto h-screen overflow-hidden">
      <Cubes
        gridSize={16}
        cellGap={{ row: 25, col: 25 }}
        maxAngle={45}
        radius={2}
        borderStyle="2.5px dashed #333354"
        faceColor="#010A17"
        rippleColor="#ff6b6b"
        rippleSpeed={2}
        autoAnimate={true}
        rippleOnClick={false}
      />

      {/* Very dark vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
              radial-gradient(
                ellipse at center,
                transparent 30%,
                rgba(1, 10, 23, 0.4) 50%,
                rgba(1, 10, 23, 0.8) 75%,
                rgba(1, 10, 23, 0.95) 90%,
                rgba(1, 10, 23, 1) 100%
              )
            `,
        }}
      />

      <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none bg-gradient-to-br from-backgroundprimary/90 via-backgroundprimary/90 to-transparent" />
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none bg-gradient-to-bl from-backgroundprimary/90 via-backgroundprimary/90 to-transparent" />
      <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none bg-gradient-to-tr from-backgroundprimary/90 via-backgroundprimary/90 to-transparent" />
      <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none bg-gradient-to-tl from-backgroundprimary/90 via-backgroundprimary/90 to-transparent" />

      <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none bg-gradient-to-b from-backgroundprimary/100 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none bg-gradient-to-t from-backgroundprimary/100 to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-48 pointer-events-none bg-gradient-to-r from-backgroundprimary/100 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-48 pointer-events-none bg-gradient-to-l from-backgroundprimary/100 to-transparent" />
    </div>
  );
};

export default Background;
