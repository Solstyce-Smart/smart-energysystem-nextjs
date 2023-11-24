"use-client";

import React from "react";
import NavbarItem from "./NavbarItem";
import { useUser } from "@clerk/nextjs";

const navbarRoutes = [
  {
    name: "Accueil",
    href: "/",
  },
  {
    name: "Notre démonstrateur",
    href: "/installation",
  },
  {
    name: "Qui sommmes-nous ?",
    href: "/qui-sommes-nous",
  },
  {
    name: "Graphiques",
    href: "/graphiques",
  },
];

const NavbarRoutes = () => {
  const user = useUser();

  return (
    <ul className="flex flex-col lg:flex-row text-center align-center justify-center list-none gap-4 lg:gap-6 h-full ">
      {navbarRoutes.map((route) => {
        if (route.name === "Graphiques" && !user.isSignedIn) {
          return;
        } else {
          return (
            <NavbarItem key={route.href} href={route.href} name={route.name} />
          );
        }
      })}
    </ul>
  );
};

export default NavbarRoutes;
