export async function getRecents() {
  const res = await fetch(`${process.env.API_URL}recent-episodes`);
  const recents = await res.json();
  return recents.results;
}

export async function getPopular() {
  const res = await fetch(`${process.env.API_URL}top-airing`);
  const popular = await res.json();
  return popular.results;
}

export async function getSearch(q: string) {
  const res = await fetch(`${process.env.API_URL}${q}`);
  const search = await res.json();
  return search.results;
}

export async function getAnimeInfo(animeId: string) {
  const res = await fetch(`${process.env.API_URL}info/${animeId}`);
  const animeInfo = await res.json();
  return animeInfo;
}

export async function getEpisodeData(episodeId: string) {
  const res = await fetch(`${process.env.API_URL}watch/${episodeId}`);
  const epData = await res.json();
  return epData;
}
