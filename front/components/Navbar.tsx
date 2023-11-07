"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import logo from "../public/logo.jpg";
import NavbarRoutes from "./NavbarRoutes";
import { Button } from "./ui/button";
import Link from "next/link";
import MobileNavbar from "./MobileNavbar";
import { useUser, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const user = useUser();
  console.log(user);

  return (
    <header className="flex h-[10vh] w-full">
      <nav className="flex justify-between items-center h-full w-full px-5 md:px-20">
        <div className="flex items-center justify-center ">
          <Link href="/" className="flex h-[50px] w-auto">
            <Image
              src={logo}
              alt="Logo de l'entreprise"
              className="h-full w-full object-cover"
              unoptimized
            />
          </Link>
        </div>
        <div className="hidden md:flex">
          <NavbarRoutes />
        </div>
        <div className="hidden md:flex gap-2">
          {user.user ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-[60px] h-[60px] shadow-slate-500 shadow-md",
                },
              }}
            />
          ) : (
            <Button
              variant="primary"
              className="transition font-bold tracking-normal"
            >
              <Link href="/sign-in">Se connecter</Link>
            </Button>
          )}
        </div>
        <div className="flex md:hidden">
          <MobileNavbar />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
