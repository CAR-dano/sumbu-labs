"use client";

import { useState, useEffect } from "react";
import SplashScreen from "../components/SplashScreen";
import ComingSoon from "../components/ComingSoon";
import Cubes from "@/components/ReactBits/Cubes/Cubes";
import Background from "@/components/Background";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Ensure splash screen shows immediately
    setIsLoaded(true);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-backgroundprimary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* Background Layer - Always present */}
      <Background />

      {/* Content Layer */}
      <div className="relative overflow-hidden">
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} duration={4000} />
        )}

        {!showSplash && (
          <>
            {/* Coming Soon Section - Full screen height */}
            <div className="min-h-screen flex items-center justify-center relative ">
              <ComingSoon />
            </div>
          </>
        )}
      </div>
    </>
  );
}
