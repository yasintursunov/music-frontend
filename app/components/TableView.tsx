'use client';

import { Song } from '../lib';
import { SongRow } from './SongRow';

export function TableView(props: { songs: Song[]; page: number; pageSize: number; lang: string; seed: string; }){
  return (
    <div className="card">
      <table className="w-full text-sm">
        <thead className="text-left border-b bg-neutral-100">
          <tr>
            <th className="px-3 py-2 w-16">#</th>
            <th className="px-3 py-2">Song</th>
            <th className="px-3 py-2">Artist</th>
            <th className="px-3 py-2">Album</th>
            <th className="px-3 py-2">Genre</th>
            <th className="px-3 py-2 text-right">Likes</th>
          </tr>
        </thead>
        <tbody>
          {props.songs.map((s) => (
            <SongRow key={s.index} song={s} lang={props.lang} seed={props.seed} page={props.page} pageSize={props.pageSize} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
