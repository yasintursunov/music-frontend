'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { coverUrl, previewUrl, lyricsUrl, Song } from '../lib';

type LyricLine = { t: number; text: string };

export function SongRow(props: { song: Song; lang: string; seed: string; page: number; pageSize: number; }){
  const [open, setOpen] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const idx = props.song.index - (props.page-1)*props.pageSize;

  useEffect(()=>{
    if (!open) return;
    const url = lyricsUrl({ lang: props.lang, seed: props.seed, page: props.page, pageSize: props.pageSize, idx });
    fetch(url).then(r=>r.json()).then(d=>{
      setLyrics(d.lines || []);
    }).catch(e=> setErr(String(e)));
  }, [open, props.lang, props.seed, props.page, props.pageSize, idx]);

  useEffect(()=>{
    if (!open) return;
    const el = audioRef.current;
    const box = scrollerRef.current;
    if (!el || !box) return;
    const id = setInterval(()=>{
      const t = el.currentTime;
      let active = 0;
      for (let i=0;i<lyrics.length;i++){
        if (lyrics[i].t <= t) active = i; else break;
      }
      
      const children = box.querySelectorAll('[data-line]');
      children.forEach((c, i)=> {
        (c as HTMLElement).style.opacity = i === active ? '1' : '0.55';
        if (i === active) (c as HTMLElement).scrollIntoView({ block: 'nearest' });
      });
    }, 120);
    return ()=> clearInterval(id);
  }, [open, lyrics]);

  return (
    <>
      <tr onClick={()=>setOpen(v=>!v)} className="cursor-pointer hover:bg-neutral-50">
        <td className="px-3 py-2 text-neutral-500">{props.song.index}</td>
        <td className="px-3 py-2 font-medium">{props.song.title}</td>
        <td className="px-3 py-2">{props.song.artist}</td>
        <td className="px-3 py-2">{props.song.album}</td>
        <td className="px-3 py-2">{props.song.genre}</td>
        <td className="px-3 py-2 text-right">{props.song.likes}</td>
      </tr>
      {open && (
        <tr className="bg-neutral-50">
          <td colSpan={6} className="px-3 py-4">
            <div className="flex gap-6">
              <img
                alt="cover"
                className="w-40 h-40 rounded-xl object-cover border"
                src={coverUrl({ lang: props.lang, seed: props.seed, page: props.page, pageSize: props.pageSize, idx })}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold mb-2">
                  {props.song.title} — <span className="text-neutral-600">{props.song.artist}</span>
                </div>

                <audio ref={audioRef} className="w-full" controls
                  src={previewUrl({ lang: props.lang, seed: props.seed, page: props.page, pageSize: props.pageSize, idx })} />

                {err && <div className="mt-3 text-sm text-red-600">Lyrics error: {err}</div>}

                <div ref={scrollerRef} className="mt-3 max-h-32 overflow-auto pr-2 space-y-1 text-sm">
                  {lyrics.map((ln, i)=>(
                    <div key={i} data-line className="transition-opacity">{ln.text}</div>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
