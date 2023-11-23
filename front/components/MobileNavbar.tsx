import React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavbarRoutes from "./NavbarRoutes";
import { Button } from "./ui/button";

const MobileNavbar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white" />
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-primary">
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
