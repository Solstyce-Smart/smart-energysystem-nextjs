import React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavbarRoutes from "./NavbarRoutes";
import { Button } from "./ui/button";

const MobileNavbar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu fill="bg-primary" />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <NavbarRoutes />
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
