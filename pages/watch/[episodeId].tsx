import Link from "next/link";
import { Inter } from "next/font/google";
import { GetStaticPaths } from "next/types";
import VideoPlayer from "@/components/VideoPlayer";
import HtmlHead from "@/components/HtmlHead";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { getAnimeInfo, getEpisodeData } from "@/helper/getData";

const inter = Inter({ subsets: ["latin"] });

export const getStaticProps = async (context: {
  params: { episodeId: string };
}) => {
  const episodeId = context.params.episodeId;
  const new_epId = episodeId.replace("-ep-", "-episode-");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["watch", new_epId], () =>
    getEpisodeData(new_epId)
  );
  let animeId = episodeId.split("-ep-")[0];
  if (animeId === "dr-stone-new-world") {
    animeId = "dr-stone-3rd-season";
  }
  await queryClient.prefetchQuery(["info", animeId], () =>
    getAnimeInfo(animeId)
  );
  if (animeId === "dr-stone-3rd-season") {
    animeId = "dr-stone-new-world";
  }
  return {
    props: {
      animeId,
      episodeId,
      new_epId,
      dehydratedState: dehydrate(queryClient),
    },
  };
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
  new_epId,
  animeId,
}: {
  episodeId: string;
  new_epId: string;
  animeId: string;
}) => {
  const animeData = useQuery({
    queryKey: ["info", animeId],
    queryFn: () => getAnimeInfo(animeId),
  });
  const epData = useQuery({
    queryKey: ["watch", new_epId],
    queryFn: () => getEpisodeData(new_epId),
  });
  const episodeNum: number = episodeId.includes("-ep-")
    ? Number.parseInt(episodeId.split("-ep-")[1])
    : 0;
  const ifNotLastEpisode: boolean =
    episodeNum !== Number.parseInt(animeData.data.totalEpisodes);
  const episodesArray = [...animeData.data.episodes].reverse();
  return (
    <>
      <HtmlHead
        title={`${animeData.data.title} Episode ${episodeNum} | Animetsu`}
      />
      <div className={inter.className}>
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl text-center">
          Playing,{" "}
          <Link
            className="font-bold hover:underline focus:underline"
            href={`/${animeData.data.id}`}
          >
            {animeData.data.title}
          </Link>{" "}
          {animeData.data.totalEpisodes !== "1" && `Episode ${episodeNum}`}
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
            <VideoPlayer
              src={epData.data.sources[epData.data.sources.length - 2].url}
            />
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
        {animeData.data.episodes.length !== 1 && (
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
