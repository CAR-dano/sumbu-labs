"use client";

import { useState, useEffect } from "react";
import SplashScreen from "../components/SplashScreen";
import ComingSoon from "../components/ComingSoon";
import Cubes from "@/components/ReactBits/Cubes/Cubes";
import Background from "@/components/Background";
import { Navigation } from "@/components/LandingPage/Navigation";
import Hero from "@/components/LandingPage/Hero";
import Slogan from "@/components/LandingPage/Slogan";
import Partner from "@/components/LandingPage/Partner";
import MagicBento from "@/components/ReactBits/MagicBento/MagicBento";
import Services from "@/components/LandingPage/Services";
import Team from "@/components/LandingPage/Team";
import Footer from "@/components/LandingPage/Footer";

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
      {/* <Background /> */}

      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} duration={4000} />
      )}

      <Navigation />
      <div className="relative">
        <Hero />
        <Slogan />
        <Partner />
        <Services />
        <Team />
        <Footer />
      </div>
    </>
  );
}
