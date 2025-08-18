import React, { useRef, useEffect, useState } from "react";

const Slogan = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [videoDirection, setVideoDirection] = useState<"forward" | "reverse">(
    "forward"
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial video state
    video.currentTime = 0;
    video.pause();

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container || !video) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const currentScrollY = window.scrollY;

      // Determine scroll direction
      const scrollDirection = currentScrollY > lastScrollY ? "down" : "up";
      setLastScrollY(currentScrollY);

      // Check if the component is in viewport
      const isInViewport = rect.top < windowHeight && rect.bottom > 0;

      if (isInViewport) {
        // Calculate scroll progress within the viewport
        const viewportProgress = Math.max(
          0,
          Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height))
        );

        // Get video duration
        if (video.duration) {
          let targetTime: number;

          if (scrollDirection === "down") {
            // Forward: play to 50% of video duration based on scroll progress
            targetTime = Math.min(
              video.duration * 0.5,
              video.duration * 0.5 * viewportProgress
            );
            setVideoDirection("forward");
          } else {
            // Reverse: play from current position backwards
            targetTime = Math.max(0, video.currentTime - video.duration * 0.01); // Reduce by 1% per scroll
            setVideoDirection("reverse");
          }

          // Smooth transition to target time
          const timeDiff = Math.abs(video.currentTime - targetTime);
          if (timeDiff > 0.1) {
            // Only update if significant difference
            video.currentTime = targetTime;
          }
        }
      }
    };

    const handleVideoLoad = () => {
      // Ensure video is ready for manipulation
      if (video.duration) {
        video.currentTime = 0;
      }
    };

    // Add event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    video.addEventListener("loadedmetadata", handleVideoLoad);

    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      video.removeEventListener("loadedmetadata", handleVideoLoad);
    };
  }, [lastScrollY]);

  return (
    <div ref={containerRef} className="flex items-center justify-center w-full">
      <div className="w-[55%] flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-auto"
          muted
          playsInline
          preload="metadata"
        >
          <source src="/assets/video/sumbulabanim.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="w-[45%] flex flex-col items-start pr-32">
        <h1 className="we-are-sumbu">We are sumbu!</h1>
        <p className="text-about">
          We turn direction into delivery. Like an axis in geometry, sumbu
          (Indonesian for “axis”) gives every project a clear origin,
          orientation, and path. We align strategy, design, and engineering so
          your ideas land exactly where they should—reliable in production,
          scalable in the long run, and elegant to use.
        </p>
      </div>
    </div>
  );
};

export default Slogan;
