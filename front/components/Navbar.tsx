"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import logo from "../public/logo.png";
import NavbarRoutes from "./NavbarRoutes";
import { Button } from "./ui/button";
import Link from "next/link";
import MobileNavbar from "./MobileNavbar";
import { UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const user = useUser();

  return (
    <header
      className="flex before:bg-gradient-to-bl  relative  before:absolute
      z-20
  before:w-full
  before:h-full
  before:from-primary
  before:via-primary
  before:to-secondary
  before:-z-10
  before:bottom-0
  before:top-[5px]
  before:blur-[2px]
  pb-[5px] bg-gradient-to-tr from-primary via-primary to-secondary h-[10vh] w-full"
    >
      <nav className="flex justify-between items-center h-full w-full px-5 lg:px-20">
        <div className="flex items-center justify-center ">
          <Link href="/" className="flex h-[4vh] w-auto p-2">
            <Image
              src={logo}
              alt="Logo de l'entreprise"
              className="h-full w-full object-cover"
              unoptimized
            />
          </Link>
        </div>
        <div className="hidden lg:flex">
          <NavbarRoutes />
        </div>
        <div className="hidden lg:flex gap-2">
          {user.user ? (
            <div className="flex items-center justify-center gap-2">
              {user.user.publicMetadata.role === 4 && (
                <Link href="/create">
                  <Button
                    variant="primary"
                    className="transition font-bold tracking-normal"
                  >
                    Création
                  </Button>
                </Link>
              )}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-[60px] h-[60px] shadow-slate-500 shadow-[0_0_10px_rgba(0,0,0,0.3)]",
                  },
                }}
              />
            </div>
          ) : (
            <Button
              variant="primary"
              className="transition font-bold tracking-normal"
            >
              <Link href="/sign-in">Se connecter</Link>
            </Button>
          )}
        </div>
        <div className="flex lg:hidden mr-5">
          <MobileNavbar />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
