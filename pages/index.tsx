import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import GokuFull from "@/public/goku-full.png";
import GokuHalf from "@/public/goku-half.png";
import HtmlHead from "@/components/HtmlHead";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [query, setQuery] = useState<string>("");
  return (
    <>
      <HtmlHead title="Animetsu" />
      <main className={`${inter.className} flex flex-col items-center`}>
        <div className="flex justify-evenly items-center w-3/4 sm:w-1/2 md:w-1/3">
          <Link
            href="/popular"
            className="text-white hover:text-blue-400 transition-colors ease-in-out"
          >
            Popular
          </Link>
          <Link
            href="/recent"
            className="text-white hover:text-blue-400 transition-colors ease-in-out"
          >
            Recent
          </Link>
        </div>
        <input
          type="text"
          name="search"
          id="search"
          className="my-4 px-6 py-3 rounded-full w-5/6 sm:w-1/2 lg:w-1/3 border-none outline-none bg-gray-700 text-white"
          placeholder="Enter Anime"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Link
          href={{
            pathname: query !== "" ? "/search" : "/",
            query: {
              q: query,
            },
          }}
          className="link-btn px-6"
        >
          Search
        </Link>
        <Image
          className="fixed bottom-8 h-2/3 -z-10 w-auto block sm:hidden"
          src={GokuFull}
          width={350}
          height={700}
          alt="goku"
          priority={true}
        />
        <Image
          className="fixed bottom-0 h-1/2 w-auto -z-10 hidden sm:block"
          src={GokuHalf}
          width={400}
          height={602}
          alt="goku"
          priority={true}
        />
      </main>
    </>
  );
}
