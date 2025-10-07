'use client';

import { useEffect, useRef } from 'react';
import { Song, coverUrl, previewUrl } from '../lib';

export function GalleryView(props: { songs: Song[]; page: number; pageSize: number; lang: string; seed: string; onLoadMore: ()=>void; }){
  const sentinelRef = useRef<HTMLDivElement|null>(null);

  useEffect(()=>{
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries)=>{
      for (const e of entries){
        if (e.isIntersecting) props.onLoadMore();
      }
    }, { rootMargin: '200px' });
    io.observe(el);
    return ()=>io.disconnect();
  }, [props.onLoadMore]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {props.songs.map((s)=>{
        const idx = s.index - (props.page-1)*props.pageSize;
        return (
          <div key={s.index} className="card p-3">
            <img alt="cover" className="w-full h-48 rounded-xl object-cover border" src={coverUrl({ lang: props.lang, seed: props.seed, page: Math.ceil(s.index/props.pageSize), pageSize: props.pageSize, idx: ((s.index-1)%props.pageSize)+1 })} />
            <div className="mt-2 font-semibold">{s.title}</div>
            <div className="text-sm text-neutral-600">{s.artist} • {s.album}</div>
            <div className="text-xs text-neutral-500">{s.genre} • Likes: {s.likes}</div>
            <audio className="w-full mt-2" controls src={previewUrl({ lang: props.lang, seed: props.seed, page: Math.ceil(s.index/props.pageSize), pageSize: props.pageSize, idx: ((s.index-1)%props.pageSize)+1 })} />
          </div>
        );
      })}
      <div ref={sentinelRef} />
    </div>
  );
}
