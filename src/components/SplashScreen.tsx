"use client";

import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number; // durasi dalam milidetik
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  const handleSkip = () => {
    if (canSkip) {
      setFadeOut(true);
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 300);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter" || e.key === "Escape") {
      handleSkip();
    }
  };

  useEffect(() => {
    // Prevent body scrolling
    document.body.classList.add("splash-active");

    // Enable skip after 1 second
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 1000);

    // Timer untuk memulai fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 500); // mulai fade out 500ms sebelum selesai

    // Timer untuk menyelesaikan splash screen
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      document.body.classList.remove("splash-active");
      onComplete();
    }, duration);

    // Add keyboard event listener
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
      document.removeEventListener("keydown", handleKeyPress);
      document.body.classList.remove("splash-active");
    };
  }, [onComplete, duration]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "#010A17", // Semi-transparent background
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-auto object-contain md:w-full md:h-full md:object-cover"
          onLoadedData={() => console.log("Video loaded")}
        >
          <source src="/assets/video/sumbulabanim.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Skip button */}
        {canSkip && (
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white transition-colors duration-200 text-xs md:text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/30 hover:border-white/60 backdrop-blur-sm"
          >
            Skip
          </button>
        )}

        {/* Skip instruction - only show on desktop */}
      </div>
    </div>
  );
};

export default SplashScreen;
