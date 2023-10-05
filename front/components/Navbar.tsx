"use client";

import Image from "next/image";
import React from "react";
import logo from "../public/logo.jpg";
import NavbarRoutes from "./NavbarRoutes";
import { Button } from "./ui/button";
import Link from "next/link";
import MobileNavbar from "./MobileNavbar";

const Navbar = () => {
  return (
    <header className="flex h-[100px] w-full">
      <nav className="flex justify-between items-center h-full w-full px-20">
        <div className="flex items-center justify-center ">
          <Link href="/" className="flex h-[50px] w-auto">
            <Image
              src={logo}
              alt="Logo de l'entreprise"
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
        <div className="hidden md:flex">
          <NavbarRoutes />
        </div>
        <div className="hidden md:flex">
          <Button
            variant="primary"
            className="transition font-bold tracking-normal"
          >
            Se connecter
          </Button>
        </div>
        <div className="flex md:hidden">
          <MobileNavbar />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
