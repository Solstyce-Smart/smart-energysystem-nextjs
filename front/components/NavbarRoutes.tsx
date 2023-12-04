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
    name: "Qui sommes-nous ?",
    href: "/qui-sommes-nous",
  },
];

const connectedRoutes = [
  {
    name: "Mes centrales",
    href: "/mes-centrales",
  },
  // {
  //   name: "Mes abonnements",
  //   href: "/mes-abonnements",
  // },
];

type NavbarRoutesProps = {
  color: string;
};
const NavbarRoutes = ({ color }: NavbarRoutesProps) => {
  const user = useUser();
  const routesToUse = user.user ? connectedRoutes : navbarRoutes;

  return (
    <ul className="flex flex-col lg:flex-row text-center align-center justify-center list-none gap-4 lg:gap-6 h-full ">
      {routesToUse.map((route) => (
        <NavbarItem
          key={route.href}
          href={route.href}
          name={route.name}
          color={color}
        />
      ))}
    </ul>
  );
};

export default NavbarRoutes;
