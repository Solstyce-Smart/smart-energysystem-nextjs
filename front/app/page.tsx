import Image from "next/image";

export default function Home() {
  return (
    <main className=" bg-primary flex flex-col md:flex-row w-full h-[100vh] justify-center items-center md:p-20 sm:p-0">
      <div className="flex flex-col flex-1 text-center items-center justify-center p-10">
        <h1 className="text-secondary font-bold md:text-8xl sm:text-6xl drop-shadow-[0_0_3px_rgba(255,255,255,1)]">
          Oups !
        </h1>
        <p className="md:mt-8 sm:mt-4 text-white">
          Le site est actuellement en maintenance, nous vous invitons à repasser
          plus tard !
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center relative">
        <Image
          src="/maintenance.svg"
          alt="Site en maintenance ! "
          width={500}
          height={500}
          className="object-cover"
          unoptimized
        />
      </div>
    </main>
  );
}
