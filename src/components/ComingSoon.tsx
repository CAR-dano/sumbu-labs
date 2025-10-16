"use client";
import React, { useEffect, useState } from "react";

const ComingSoon = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger entrance animation immediately
    setIsVisible(true);

    // Show content with delay for staggered animation
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex items-center justify-center transition-all duration-1000 ease-out pointer-events-none ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center px-6 relative z-10 pointer-events-none max-w-4xl mx-auto">
        {/* Content remains the same */}
        <h1
          className={`text-6xl md:text-8xl font-bold mb-8 font-roboto transition-all duration-1000 ease-out transform ${
            showContent
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          }`}
          style={{
            background:
              "linear-gradient(93deg, #AA6AFE -6.02%, #DEBCFF 51.58%, #AA6AFE 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            backgroundSize: "200% 100%",
            backgroundRepeat: "no-repeat",
            display: "inline-block",
            lineHeight: "1.2",
            animation: showContent
              ? "gradientShift 3s ease-in-out infinite, textPulse 2s ease-in-out infinite"
              : "none",
          }}
        >
          Coming Soon
        </h1>

        {/* Loading dots animation */}
        <div
          className={`flex justify-center items-center space-x-3 transition-all duration-1000 ease-out transform ${
            showContent
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "0.3s" }}
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full animate-enhanced-bounce"
              style={{
                background:
                  index % 2 === 0
                    ? "linear-gradient(135deg, #AA6AFE, #DEBCFF)"
                    : "linear-gradient(135deg, #DEBCFF, #AA6AFE)",
                animationDelay: `${index * 0.2}s`,
                boxShadow: "0 0 10px rgba(170, 106, 254, 0.5)",
              }}
            />
          ))}
        </div>

        {/* Subtitle text */}
        <div
          className={`mt-8 transition-all duration-1000 ease-out transform ${
            showContent ? "translate-y-0 opacity-70" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "0.6s" }}
        >
          <p className="text-white/70 text-lg md:text-xl font-light tracking-wide">
            Something amazing is on the way
          </p>
        </div>

        {/* Floating particles */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-2000 ${
            showContent ? "opacity-40" : "opacity-0"
          }`}
          style={{ transitionDelay: "0.8s" }}
        >
          {/* Particle 1 */}
          <div
            className="absolute w-2 h-2 bg-purple-400 rounded-full animate-float-slow"
            style={{
              top: "20%",
              left: "10%",
              animationDuration: "6s",
              boxShadow: "0 0 8px rgba(170, 106, 254, 0.6)",
            }}
          />

          {/* Particle 2 */}
          <div
            className="absolute w-1 h-1 bg-purple-300 rounded-full animate-float-slow"
            style={{
              top: "30%",
              right: "15%",
              animationDuration: "8s",
              animationDirection: "reverse",
              animationDelay: "1s",
              boxShadow: "0 0 6px rgba(222, 188, 255, 0.6)",
            }}
          />

          {/* Particle 3 */}
          <div
            className="absolute w-1.5 h-1.5 bg-purple-500 rounded-full animate-float-slow"
            style={{
              bottom: "25%",
              left: "20%",
              animationDuration: "7s",
              animationDelay: "2s",
              boxShadow: "0 0 10px rgba(170, 106, 254, 0.7)",
            }}
          />

          {/* Particle 4 */}
          <div
            className="absolute w-1 h-1 bg-purple-200 rounded-full animate-float-slow"
            style={{
              bottom: "35%",
              right: "25%",
              animationDuration: "9s",
              animationDirection: "reverse",
              animationDelay: "0.5s",
              boxShadow: "0 0 5px rgba(222, 188, 255, 0.5)",
            }}
          />

          {/* Additional particles for more ambient effect */}
          <div
            className="absolute w-0.5 h-0.5 bg-purple-100 rounded-full animate-float-slow"
            style={{
              top: "60%",
              left: "80%",
              animationDuration: "10s",
              animationDelay: "3s",
              boxShadow: "0 0 4px rgba(255, 255, 255, 0.4)",
            }}
          />

          <div
            className="absolute w-1 h-1 bg-purple-600 rounded-full animate-float-slow"
            style={{
              top: "70%",
              left: "5%",
              animationDuration: "11s",
              animationDirection: "reverse",
              animationDelay: "1.5s",
              boxShadow: "0 0 7px rgba(170, 106, 254, 0.8)",
            }}
          />
        </div>

        {/* Glow effect behind text */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-2000 ${
            showContent ? "opacity-20" : "opacity-0"
          }`}
          style={{ transitionDelay: "1s" }}
        >
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"
            style={{
              animationDuration: "4s",
              background:
                "radial-gradient(circle, rgba(170, 106, 254, 0.3) 0%, transparent 70%)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;

