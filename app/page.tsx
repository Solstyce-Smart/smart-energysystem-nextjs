import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row w-full h-[100vh] justify-center items-center md:p-20 sm:p-0">
      <div className="flex flex-col flex-1 text-center items-center justify-center p-10">
        <h1 className="text-[#04276E] font-bold md:text-8xl sm:text-6xl">
          Oups !
        </h1>
        <h2 className="text-[#04276E] font-semibold md:text-4xl sm:text-3xl md:mt-4 sm:mt-2">
          En maintenance
        </h2>
        <p className="md:mt-8 sm:mt-4">
          Le site est actuellement en maintenance, nous vous invitons à repasser
          plus tard !
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center relative">
        <Image
          src="/20945385.jpg"
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
