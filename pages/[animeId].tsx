import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import HtmlHead from "@/components/HtmlHead";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { getAnimeInfo } from "@/helper/getData";

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps = async (context: {
  params: { animeId: string };
}) => {
  const animeId = context.params.animeId;
  // const res = await fetch(`${process.env.API_URL}info/${animeId}`);
  // const data = await res.json();
  // return { props: { data } };
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["info", animeId], () =>
    getAnimeInfo(animeId)
  );
  return {
    props: { animeId, dehydratedState: dehydrate(queryClient) },
  };
};

const AnimeId = ({ animeId }: { animeId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["info", animeId],
    queryFn: () => getAnimeInfo(animeId),
  });
  const longSynopsis = data.description.length > 100;
  const episodesArray = [...data.episodes].reverse();
  if (data.type !== "OVA" && data.type !== "ONA") {
    data.type =
      data.type[0].toUpperCase() + data.type.substring(1).toLowerCase();
  }

  return (
    <>
      <HtmlHead title={`${data.title} | Animetsu`} />
      <div className={`${inter.className} mx-1 sm:mx-4 lg:mx-6`}>
        <div id="info" className="flex flex-col lg:flex-row">
          <Image
            className="rounded-md w-auto md:h-96 mb-6 hidden md:block lg:mb-0"
            src={data.image}
            alt={data.title}
            width={300}
            height={600}
            style={{ objectFit: "cover" }}
            priority={true}
          />
          <div className="ml-4">
            <h2 className="text-2xl sm:text-4xl font-bold mb-0 sm:mb-1">
              {data.title}
            </h2>
            <span className="opacity-50">{data.type}</span>
            <p
              className={`opacity-50 my-3 ${
                longSynopsis ? "text-xs sm:text-sm" : "text-sm sm:text-md"
              }`}
            >
              {data.description}
            </p>
            <p className="text-sm sm:text-base">
              Genre:{" "}
              <span className="opacity-50">
                {data.genres.map((g: string, i: number) => (
                  <span key={i}>
                    {g}
                    {data.genres.length === i + 1 || ", "}
                  </span>
                ))}
              </span>
            </p>
            <p className="my-1 text-sm sm:text-base">
              Status: <span className="opacity-50">{data.status}</span>
            </p>
            <p className="text-sm sm:text-base">
              {data.totalEpisodes !== "1" ? "Episodes: " : "Episode: "}
              <span className="opacity-50">{data.totalEpisodes}</span>
            </p>
            <p className="my-1 text-sm sm:text-base">
              Released: <span className="opacity-50">{data.releaseDate}</span>
            </p>
            {data.otherName === "" || (
              <p className="text-sm sm:text-base">
                Other Names:{" "}
                <span className="opacity-50">{data.otherName}</span>
              </p>
            )}
          </div>
        </div>
        {(data.episodes.length !== 0 && data.type === "Movie") ||
        data.type === "Special" ? (
          <div className="my-8">
            <Link
              href={`/watch/${data.episodes[0].id.replace("episode", "ep")}`}
              className="link-btn px-6"
            >
              Watch {data.type}
            </Link>
          </div>
        ) : (
          <div
            className={`mt-8 mb-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4`}
          >
            {episodesArray.map(
              (e) =>
                e.number === "0" || (
                  <Link
                    key={e.id}
                    className="link-btn"
                    href={`/watch/${e.id.replace("episode", "ep")}`}
                  >
                    {e.number}
                  </Link>
                )
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AnimeId;
