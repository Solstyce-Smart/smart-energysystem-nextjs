import React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavbarRoutes from "./NavbarRoutes";
import { Button } from "./ui/button";
import BottomBarRoutes from "./BottomBarRoutes";

const MobileNavbar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white" />
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-gradient-to-br from-primary via-primary via-80% to-secondary text-primary justify-between items-center">
        <div className="flex flex-col gap-4 justify-self-center self-center h-1/2 w-full">
          <NavbarRoutes />
          <BottomBarRoutes />
        </div>
        <Button
          variant="primary"
          className="transition font-bold tracking-normal"
        >
          Se connecter
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
