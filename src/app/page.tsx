"use client";

import { useState } from "react";
import SplashScreen from "../components/SplashScreen";
import ComingSoon from "../components/ComingSoon";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className="relative bg-backgroundprimary">
      {showSplash && (
        <SplashScreen
          onComplete={handleSplashComplete}
          duration={4000} // 4 detik
        />
      )}

      {!showSplash && <ComingSoon />}
    </div>
  );
}
