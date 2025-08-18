import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const Hero = () => {
  return (
    <div
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center relative"
    >
      <h1 className="gradient-text font-roboto">
        Aligning Your Ideas <br />
        Across Every Axis
      </h1>

      <p className="hero-text font-roboto">
        At sumbu labs, we align <span className="highlight">vision</span>,{" "}
        <span className="highlight">technology</span>, and{" "}
        <span className="highlight">execution</span> on the same plane.
      </p>

      <div className="div-button flex items-center justify-center">
        <button className="btn-cta">View our work</button>
        <button className="btn-cta-2">
          <MdKeyboardArrowDown size={36} />
        </button>
      </div>
    </div>
  );
};

export default Hero;
