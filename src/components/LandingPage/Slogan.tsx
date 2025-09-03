import React from "react";

const Slogan = () => {
  return (
    <div
      id="about"
      className="relative flex flex-col lg:flex-row items-center justify-center md:min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-0"
    >
      {/* Gradient overlay at the top */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-backgroundprimary pointer-events-none z-10"></div>

      <div className="w-full lg:w-1/2 flex items-center justify-center mb-8 lg:mb-0">
        <video
          className="w-full max-w-md lg:max-w-full h-auto rounded-lg shadow-lg"
          autoPlay
          muted
          playsInline
          loop
        >
          <source src="/assets/video/sumbulabanim.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start px-4 lg:pr-32 lg:pl-8">
        <h1 className="we-are-sumbu text-center lg:text-left">We are sumbu!</h1>
        <p className="text-about text-center lg:text-justify max-w-2xl lg:max-w-none">
          We turn direction into delivery. Like an axis in geometry, sumbu
          (Indonesian for &quot;axis&quot;) gives every project a clear origin,
          orientation, and path. We align strategy, design, and engineering so
          your ideas land exactly where they should—reliable in production,
          scalable in the long run, and elegant to use.
        </p>
      </div>
    </div>
  );
};

export default Slogan;
