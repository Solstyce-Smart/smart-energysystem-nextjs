"use client";
import Image from "next/image";
import Lottie from "lottie-react";
import animation from "@/public/acceuil.json";

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row w-full h-[90vh] justify-center items-center md:p-20 sm:p-0">
      <div className="flex flex-col flex-1 text-center items-center justify-center p-10">
        <h1 className="text-primary font-bold md:text-8xl sm:text-6xl">
          Oups !
        </h1>
        <h2 className="text-primary font-semibold md:text-4xl sm:text-3xl md:mt-4 sm:mt-2">
          En maintenance
        </h2>
        <p className="md:mt-8 sm:mt-4">
          Le site est actuellement en maintenance, nous vous invitons à repasser
          plus tard !
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center relative">
        <Lottie
          animationData={animation}
          style={{ width: "25vw", minWidth: "400px" }}
        />
      </div>
    </main>
  );
}
