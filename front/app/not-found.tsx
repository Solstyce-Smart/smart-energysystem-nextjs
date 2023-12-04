"use client";

import Lottie from "lottie-react";
import React, { useRef, useState } from "react";
import notfound from "@/public/404.json";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  const user = useUser();
  const lottieRef = useRef(null);

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center flex-col",
        user.user ? "h-[90vh]" : "h-[85vh]"
      )}
    >
      <Lottie
        ref={lottieRef}
        animationData={notfound}
        style={{
          width: "25vw",
          minWidth: "400px",
        }}
        loop={false}
      />
      <Button className="mt-4">
        <Link href="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
};

export default NotFound;
