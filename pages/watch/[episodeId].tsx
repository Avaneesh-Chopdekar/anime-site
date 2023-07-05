import Link from "next/link";
import { Inter } from "next/font/google";
import { GetStaticPaths } from "next/types";
import VideoPlayer from "@/components/VideoPlayer";
import HtmlHead from "@/components/HtmlHead";

const inter = Inter({ subsets: ["latin"] });

export const getStaticProps = async (context: {
  params: { episodeId: string };
}) => {
  const episodeId = context.params.episodeId;
  const epRes = await fetch(
    `${process.env.API_URL}watch/${episodeId.replace("ep", "episode")}`
  );
  const epData = await epRes.json();
  let animeId = episodeId.split("-ep-")[0];
  if (animeId === "dr-stone-new-world") {
    animeId = "dr-stone-3rd-season";
  }
  const animeRes = await fetch(`${process.env.API_URL}info/${animeId}`);
  const animeInfo = await animeRes.json();
  if (animeId === "dr-stone-3rd-season") {
    animeId = "dr-stone-new-world";
  }
  return { props: { episodeId, epData, animeId, animeInfo } };
};

export const getStaticPaths: GetStaticPaths<{
  episodeId: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const Watch = ({
  episodeId,
  epData,
  animeId,
  animeInfo,
}: {
  episodeId: string;
  epData: EpisodeInfo;
  animeId: string;
  animeInfo: AnimeInfo;
}) => {
  const episodeNum: number = episodeId.includes("-ep-")
    ? Number.parseInt(episodeId.split("-ep-")[1])
    : 0;
  const ifNotLastEpisode: boolean =
    episodeNum !== Number.parseInt(animeInfo.totalEpisodes);
  const episodesArray = [...animeInfo.episodes].reverse();
  return (
    <>
      <HtmlHead title={`${animeInfo.title} Episode ${episodeNum} | Animetsu`} />
      <div className={inter.className}>
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl text-center">
          Playing,{" "}
          <Link
            className="font-bold hover:underline focus:underline"
            href={`/${animeInfo.id}`}
          >
            {animeInfo.title}
          </Link>{" "}
          {animeInfo.totalEpisodes !== "1" && `Episode ${episodeNum}`}
        </h2>
        <div className="flex justify-center">
          {/* <iframe
            className="my-4 aspect-video w-80 h-64 sm:w-[400px] sm:h-[225px] md:w-[600px] md:h-[340px]"
            width="600"
            src={epData.headers.Referer}
            allowFullScreen
            scrolling="no"
          /> */}
          <div className="my-4 aspect-video h-[180px] sm:h-[225px] md:h-[340px]">
            <VideoPlayer src={epData.sources[epData.sources.length - 2].url} />
          </div>
        </div>
        <p className="text-sm sm:text-base text-center py-2">
          Reload the site if video not loaded
        </p>
        <div className="flex justify-center">
          {episodeNum !== 1 && (
            <Link
              className={`link-btn px-6 ${ifNotLastEpisode && "mr-4"}`}
              href={`/watch/${animeId}-ep-${episodeNum - 1}`}
              key={episodeNum}
            >
              Prev
            </Link>
          )}
          {ifNotLastEpisode && (
            <Link
              className="link-btn px-6"
              href={`/watch/${animeId}-ep-${episodeNum + 1}`}
            >
              Next
            </Link>
          )}
        </div>
        {animeInfo.episodes.length !== 1 && (
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

export default Watch;
