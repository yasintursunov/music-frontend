'use client';

type Lang = 'en-US' | 'de-DE';
type Mode = 'table' | 'gallery';

export function Toolbar(props: {
  lang: Lang;
  setLang: (v: Lang) => void;
  seed: string;
  setSeed: (v: string) => void;
  likes: number;
  setLikes: (v: number) => void;
  onRandomizeSeed: () => void;
  mode: Mode;
  setMode: (m: Mode) => void;
}) {
  return (
    <div className="toolbar w-full">
      <div className="max-w-6xl mx-auto flex items-center gap-4 px-4 py-3">
        {/* LEFT: controls */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Language</label>
          <select
            className="btn"
            value={props.lang}
            onChange={e => props.setLang(e.target.value as Lang)}
          >
            <option value="en-US">English (US)</option>
            <option value="de-DE">Deutsch (DE)</option>
          </select>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Seed</label>
            <input
              className="btn w-48"
              value={props.seed}
              onChange={e => props.setSeed(e.target.value.replace(/[^0-9]/g, ''))}
            />
            <button className="btn" onClick={props.onRandomizeSeed}>Random</button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Likes</label>
            <input
              type="range" min={0} max={10} step={0.1}
              value={props.likes}
              onChange={e => props.setLikes(parseFloat(e.target.value))}
            />
            <span className="w-10 text-right tabular-nums">{props.likes.toFixed(1)}</span>
          </div>
        </div>

        {/* RIGHT: mode toggle */}
        <div className="ml-auto flex items-center gap-2">
          <button
            className={`btn ${props.mode==='table' ? 'bg-neutral-900 text-white' : ''}`}
            onClick={()=>props.setMode('table')}
          >
            Table
          </button>
          <button
            className={`btn ${props.mode==='gallery' ? 'bg-neutral-900 text-white' : ''}`}
            onClick={()=>props.setMode('gallery')}
          >
            Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
