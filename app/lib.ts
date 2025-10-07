export const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export type Song = {
  index: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  likes: number;
};

export type BatchResponse = {
  page: number;
  pageSize: number;
  lang: string;
  seed: string;
  likes: number;
  items: Song[];
};

export async function fetchSongs(params: { lang: string; seed: string; likes: number; page: number; pageSize: number; }) {
  const qs = new URLSearchParams({
    lang: params.lang,
    seed: params.seed,
    likes: String(params.likes),
    page: String(params.page),
    pageSize: String(params.pageSize),
  });
  const url = `${BACKEND}/api/songs?${qs.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const txt = await res.text().catch(()=> '');
    throw new Error(`Fetch failed ${res.status}: ${txt}`);
  }
  return res.json() as Promise<BatchResponse>;
}

export function coverUrl(p: { lang: string; seed: string; page: number; pageSize: number; idx: number }) {
  const qs = new URLSearchParams({
    lang: p.lang, seed: p.seed,
    page: String(p.page), pageSize: String(p.pageSize), idx: String(p.idx),
  });
  return `${BACKEND}/api/cover?${qs.toString()}`;
}

export function previewUrl(p: { lang: string; seed: string; page: number; pageSize: number; idx: number }) {
  const qs = new URLSearchParams({
    lang: p.lang, seed: p.seed,
    page: String(p.page), pageSize: String(p.pageSize), idx: String(p.idx),
  });
  return `${BACKEND}/api/preview?${qs.toString()}`;
}

export function lyricsUrl(p: { lang: string; seed: string; page: number; pageSize: number; idx: number }) {
  const qs = new URLSearchParams({
    lang: p.lang, seed: p.seed,
    page: String(p.page), pageSize: String(p.pageSize), idx: String(p.idx),
  });
  return `${BACKEND}/api/lyrics?${qs.toString()}`;
}
