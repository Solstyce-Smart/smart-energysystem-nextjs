import React, { useEffect, useState } from "react";
import NavbarItem from "./NavbarItem";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

type BottomBarRoutesProps = {
  color: string;
};
const BottomBarRoutes = ({ color }: BottomBarRoutesProps) => {
  const user = useUser();
  const pathname = usePathname();

  const [centraleId, setCentraleId] = useState("");

  useEffect(() => {
    if (pathname.startsWith("/centrale/")) {
      setCentraleId(pathname);
    }
  }, [pathname]);

  const bottomBarRoutes = [
    {
      name: "Vue principale",
      href: centraleId,
    },
    {
      name: "Paramétrage de la centrale",
      href: "/settings",
    },
  ];

  if (user?.user?.publicMetadata.role === 4) {
    if (!bottomBarRoutes.find((route) => route.name === "Historique")) {
      bottomBarRoutes.push({
        name: "Historique",
        href: "/graphiques",
      });
    }
  }

  return (
    <ul className="flex flex-col lg:flex-row text-center items-center justify-center list-none gap-4 lg:gap-6 w-full h-full">
      {bottomBarRoutes.map((route) => {
        return (
          <NavbarItem
            key={route.href}
            href={route.href}
            name={route.name}
            color={color}
          />
        );
      })}
    </ul>
  );
};

export default BottomBarRoutes;
