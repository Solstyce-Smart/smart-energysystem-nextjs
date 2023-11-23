import { Loader2Icon } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white min-h-[90vh]">
      <Loader2Icon
        size="100"
        className="animate-spin text-secondary bg-transparent rounded-full border-4 shadow-secondary shadow-[0_0_20px_rgba(0,0,0,1)]"
      />
    </div>
  );
};

export default Loader;
