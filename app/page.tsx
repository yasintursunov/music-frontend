'use client';

import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetchSongs, BatchResponse } from './lib';
import { Toolbar } from './components/Toolbar';
import { TableView } from './components/TableView';
import { GalleryView } from './components/GalleryView';

type Mode = 'table' | 'gallery';
type Lang = 'en-US' | 'de-DE';
type KeyTuple = ['songs', Lang, string, number, number, number];

const PAGE_SIZE_TABLE = 10;
const PAGE_SIZE_GALLERY = 12;

function randomSeed64(): string {
  const hi = Math.floor(Math.random() * 0xffffffff);
  const lo = Math.floor(Math.random() * 0xffffffff);
  return ((BigInt(hi) << 32n) + BigInt(lo)).toString();
}

export default function Page() {
  const [lang, setLang] = useState<Lang>('en-US');
  const [seed, setSeed] = useState<string>(randomSeed64());
  const [likes, setLikes] = useState<number>(3.0);
  const [mode, setMode] = useState<Mode>('table');
  const [page, setPage] = useState<number>(1);

  const pageSize = mode === 'table' ? PAGE_SIZE_TABLE : PAGE_SIZE_GALLERY;

  const swrKey: KeyTuple = ['songs', lang, seed, likes, page, pageSize];

  const { data, error, isLoading } = useSWR<BatchResponse, Error, KeyTuple>(
    swrKey,
    
    ([, _lang, _seed, _likes, _page, _pageSize]: KeyTuple) =>
      fetchSongs({
        lang: _lang,
        seed: _seed,
        likes: _likes,
        page: _page,
        pageSize: _pageSize,
      }),
    { revalidateOnFocus: false }
  );

  useEffect(() => { setPage(1); }, [lang, seed, mode]);

  const onRandomizeSeed = useCallback(() => setSeed(randomSeed64()), []);

  const [galleryItems, setGalleryItems] = useState<BatchResponse['items']>([]);
  useEffect(() => {
    if (mode === 'gallery') { setGalleryItems([]); setPage(1); }
  }, [lang, seed, mode]);

  useEffect(() => {
    if (!data) return;
    if (mode === 'gallery') {
      if (page === 1) setGalleryItems(data.items);
      else setGalleryItems(prev => [...prev, ...data.items]);
    }
  }, [data, mode, page]);

  const onLoadMore = useCallback(() => {
    if (mode !== 'gallery') return;
    setPage(p => p + 1);
  }, [mode]);

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-4">
      <Toolbar
        lang={lang} setLang={setLang}
        seed={seed} setSeed={setSeed}
        likes={likes} setLikes={setLikes}
        onRandomizeSeed={onRandomizeSeed}
        mode={mode} setMode={setMode}
      />

      {error && (
        <div className="p-3 rounded-xl border border-red-300 bg-red-50 text-red-700 text-sm">
          Failed to load songs from <b>{process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}</b><br/>
          {String(error)}
        </div>
      )}
      {isLoading && (
        <div className="p-3 rounded-xl border bg-neutral-50 text-neutral-600 text-sm">Loading songs…</div>
      )}

      {mode === 'table' && data && (
        <div className="space-y-3">
          <TableView songs={data.items} page={page} pageSize={pageSize} lang={lang} seed={seed} />
          <div className="flex items-center justify-center gap-2">
            <button className="btn" onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
            <div className="px-2 py-1 rounded bg-neutral-100 border">{page}</div>
            <button className="btn" onClick={()=>setPage(p=>p+1)}>Next</button>
          </div>
        </div>
      )}

      {mode === 'gallery' && data && (
        <GalleryView songs={galleryItems} page={page} pageSize={pageSize} lang={lang} seed={seed} onLoadMore={onLoadMore} />
      )}
    </main>
  );
}
