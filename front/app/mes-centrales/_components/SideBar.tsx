"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";

const SideBar = ({ centrales }: any) => {
  return (
    <Sheet>
      <SheetTrigger>
        <div className="flex w-5 h-full min-h-[90vh] items-center justify-center bg-white border-r-2 border-primary/30">
          <ArrowBigRight className="absolute ml-4 text-primary w-8 h-8 bg-white rounded-sm" />
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="w-[200px]">
        <SheetHeader>
          <SheetTitle className="mb-8">Liste des centrales</SheetTitle>
          <SheetDescription>
            {centrales.map((centrale: any) => (
              <Link
                href={`/centrale/${centrale.id}`}
                key={centrale.name}
                className="font-medium"
              >
                {centrale.name}
              </Link>
            ))}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SideBar;
