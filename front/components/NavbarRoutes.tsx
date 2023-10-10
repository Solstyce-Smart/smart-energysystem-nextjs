"use-client";

import React from "react";
import NavbarItem from "./NavbarItem";

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
];

const NavbarRoutes = () => {
  return (
    <ul className="flex flex-col md:flex-row text-center align-center justify-center list-none gap-24 md:gap-6 h-full ">
      {navbarRoutes.map((route) => (
        <NavbarItem key={route.href} href={route.href} name={route.name} />
      ))}
    </ul>
  );
};

export default NavbarRoutes;
