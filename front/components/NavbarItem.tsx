"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavbarItemProps {
  name: string;
  href: string;
}

const NavbarItem = ({ name, href }: NavbarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li
      className={cn(
        "text-white/70 font-semibold hover:text-white transition",
        isActive && "text-white font-bold underline underline-offset-2"
      )}
    >
      <Link href={href}>{name}</Link>
    </li>
  );
};

export default NavbarItem;
