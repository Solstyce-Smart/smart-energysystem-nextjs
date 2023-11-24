import Lottie from "lottie-react";
import React from "react";
import loader from "@/public/loader.json";

const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white min-h-[90vh]">
      <Lottie
        animationData={loader}
        style={{
          width: "200px",
          height: "200px",
        }}
      />
    </div>
  );
};

export default Loader;
