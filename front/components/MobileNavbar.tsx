"use client";

import React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavbarRoutes from "./NavbarRoutes";
import { Button } from "./ui/button";
import BottomBarRoutes from "./BottomBarRoutes";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

const MobileNavbar = () => {
  const user = useUser();
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white" />
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-white text-primary justify-between items-center">
        <div className="flex flex-col gap-4 justify-self-center self-center h-1/2 w-full">
          <NavbarRoutes color="primary" />
          <BottomBarRoutes color="primary" />
        </div>
        {user.user ? (
          <div className="flex flex-col items-center justify-center gap-2">
            {user.user.publicMetadata.role === 4 && (
              <Link href="/create">
                <Button
                  variant="ghost"
                  className="transition font-bold tracking-normal text-primary"
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
            variant="ghost"
            className="transition font-bold tracking-normal text-primary"
          >
            <Link href="/sign-in">Se connecter</Link>
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
