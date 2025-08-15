import React from "react";

const ComingSoon = () => {
  return (
    <div className="w-full min-h-screen bg-backgroundprimary flex items-center justify-center fixed inset-0">
      <div className="text-center px-6">
        <h1
          className="text-6xl md:text-8xl font-bold mb-8 font-roboto "
          style={{
            background:
              "linear-gradient(93deg, #AA6AFE -6.02%, #DEBCFF 51.58%, #AA6AFE 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            display: "inline-block",
            lineHeight: "1.2",
          }}
        >
          Coming Soon
        </h1>

        {/* Loading dots animation */}
        <div className="flex justify-center items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
