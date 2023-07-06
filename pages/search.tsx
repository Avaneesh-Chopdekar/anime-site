import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import HtmlHead from "@/components/HtmlHead";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { getSearch } from "@/helper/getData";

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps = async (context: { query: { q: string } }) => {
  const q = context.query.q;
  // const res = await fetch(`${process.env.API_URL}${q}`);
  // const searchResults = await res.json();
  // return { props: { q, searchResults: searchResults.results } };
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["search"], () => getSearch(q));
  return {
    props: { q, dehydratedState: dehydrate(queryClient) },
  };
};

const Search = ({ q }: { q: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["search"],
    queryFn: () => getSearch(q),
  });
  return (
    <div className={inter.className}>
      <HtmlHead title="Animetsu" />
      <h1 className="text-base sm:text-lg md:text-xl mb-4">
        Search results for: <i>{q}</i>
      </h1>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
        {data.map((anime: Anime) => (
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

export default Search;
