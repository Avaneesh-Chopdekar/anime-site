import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import HtmlHead from "@/components/HtmlHead";

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps = async () => {
  const res = await fetch(`${process.env.API_URL}top-airing`);
  const popular = await res.json();
  return { props: { popular: popular.results } };
};

const Popular = ({ popular }: { popular: Anime[] }) => {
  return (
    <div className={inter.className}>
      <HtmlHead title="Popular | Animetsu" />
      <h1 className="text-center text-base sm:text-lg md:text-xl mb-4">
        Popular this season
      </h1>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
        {popular.map((anime) => (
          <li
            key={anime.id}
            className="mb-2 cursor-pointer"
            title={anime.title}
          >
            <Link href={`/${anime.id}`}>
              <Image
                src={anime.image}
                alt={anime.title}
                width={250}
                height={450}
                loading="lazy"
                style={{ objectFit: "cover" }}
                className="mx-auto mb-2 rounded-md w-40 h-64 lg:w-64 lg:h-96"
              />
              <div className="text-center text-xs md:text-sm">
                {anime.id === "oshi-no-ko"
                  ? "Oshi no ko"
                  : anime.id === "oshi-no-ko-dub"
                  ? "Oshi no ko (Dub)"
                  : anime.title}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Popular;
