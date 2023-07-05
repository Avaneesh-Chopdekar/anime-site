import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import HtmlHead from "@/components/HtmlHead";

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps = async (context: {
  params: { animeId: string };
}) => {
  const animeId = context.params.animeId;
  const res = await fetch(`${process.env.API_URL}info/${animeId}`);
  const animeInfo = await res.json();
  return { props: { animeInfo } };
};

const AnimeId = ({ animeInfo }: { animeInfo: AnimeInfo }) => {
  const longSynopsis = animeInfo.description.length > 100;
  const episodesArray = [...animeInfo.episodes].reverse();
  if (animeInfo.type !== "OVA" && animeInfo.type !== "ONA") {
    animeInfo.type =
      animeInfo.type[0].toUpperCase() +
      animeInfo.type.substring(1).toLowerCase();
  }

  return (
    <>
      <HtmlHead title={`${animeInfo.title} | Animetsu`} />
      <div className={`${inter.className} mx-1 sm:mx-4 lg:mx-6`}>
        <div id="info" className="flex flex-col lg:flex-row">
          <Image
            className="rounded-md w-auto md:h-96 mb-6 hidden md:block lg:mb-0"
            src={animeInfo.image}
            alt={animeInfo.title}
            width={300}
            height={600}
            style={{ objectFit: "cover" }}
            priority={true}
          />
          <div className="ml-4">
            <h2 className="text-2xl sm:text-4xl font-bold mb-0 sm:mb-1">
              {animeInfo.title}
            </h2>
            <span className="opacity-50">{animeInfo.type}</span>
            <p
              className={`opacity-50 my-3 ${
                longSynopsis ? "text-xs sm:text-sm" : "text-sm sm:text-md"
              }`}
            >
              {animeInfo.description}
            </p>
            <p className="text-sm sm:text-base">
              Genre:{" "}
              <span className="opacity-50">
                {animeInfo.genres.map((g, i) => (
                  <span key={i}>
                    {g}
                    {animeInfo.genres.length === i + 1 || ", "}
                  </span>
                ))}
              </span>
            </p>
            <p className="my-1 text-sm sm:text-base">
              Status: <span className="opacity-50">{animeInfo.status}</span>
            </p>
            <p className="text-sm sm:text-base">
              {animeInfo.totalEpisodes !== "1" ? "Episodes: " : "Episode: "}
              <span className="opacity-50">{animeInfo.totalEpisodes}</span>
            </p>
            <p className="my-1 text-sm sm:text-base">
              Released:{" "}
              <span className="opacity-50">{animeInfo.releaseDate}</span>
            </p>
            {animeInfo.otherName === "" || (
              <p className="text-sm sm:text-base">
                Other Names:{" "}
                <span className="opacity-50">{animeInfo.otherName}</span>
              </p>
            )}
          </div>
        </div>
        {(animeInfo.episodes.length !== 0 && animeInfo.type === "Movie") ||
        animeInfo.type === "Special" ? (
          <div className="my-8">
            <Link
              href={`/watch/${animeInfo.episodes[0].id.replace(
                "episode",
                "ep"
              )}`}
              className="link-btn px-6"
            >
              Watch {animeInfo.type}
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
