import React from "react";
import BottomBarRoutes from "./BottomBarRoutes";
import { usePathname } from "next/navigation";

const BottomBar = () => {
  const pathname = usePathname();

  if (
    pathname.startsWith("/centrale/") ||
    pathname === "/graphiques" ||
    pathname === "/settings"
  ) {
    return (
      <div className="flex px-5 lg:px-20 justify-center items-center w-full h-[5vh] bg-gradient-to-tr from-primary via-primary to-secondary">
        <BottomBarRoutes />
      </div>
    );
  } else {
    return null;
  }
};

export default BottomBar;
