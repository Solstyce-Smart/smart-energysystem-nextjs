"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const pathname = usePathname();
const checkRoute = () => {
  return pathname === "/" ? null : <Navbar />;
};

export default checkRoute;
