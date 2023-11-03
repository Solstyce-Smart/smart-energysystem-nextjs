import { Loader2Icon } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-primary min-h-[90vh]">
      <Loader2Icon
        size="100"
        className="animate-spin text-secondary bg-transparent rounded-full border-4"
      />
    </div>
  );
};

export default Loader;
