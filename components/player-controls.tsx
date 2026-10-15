"use client";
import {
  Heart,
  ListMusic,
  Maximize2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import type { Dispatch } from "react";
import { type PortfolioEntry } from "@/lib/portfolio";
import {
  formatTime,
  type PlayerAction,
  type PlayerState,
} from "@/lib/player-state";
import { Cover } from "./shared";
export function Transport({
  state,
  dispatch,
  compact = false,
  duration,
}: {
  duration: number;
  state: PlayerState;
  dispatch: Dispatch<PlayerAction>;
  compact?: boolean;
}) {
  return (
    <div className={`transport ${compact ? "transport-large" : ""}`}>
      <button
        className={`icon-button ${state.shuffle ? "active-control" : ""}`}
        aria-label="Shuffle entries"
        aria-pressed={state.shuffle}
        onClick={() => dispatch({ type: "shuffle" })}
      >
        <Shuffle size={18} />
      </button>
      <button
        className="icon-button"
        aria-label="Previous entry"
        onClick={() => dispatch({ type: "previous" })}
      >
        <SkipBack size={20} fill="currentColor" />
      </button>
      <button
        className="transport-play"
        aria-label={state.playing ? "Pause walkthrough" : "Play walkthrough"}
        onClick={() => dispatch({ type: "toggle", duration })}
      >
        {state.playing ? (
          <Pause size={20} fill="currentColor" />
        ) : (
          <Play size={20} fill="currentColor" />
        )}
      </button>
      <button
        className="icon-button"
        aria-label="Next entry"
        onClick={() => dispatch({ type: "next", random: Math.random() })}
      >
        <SkipForward size={20} fill="currentColor" />
      </button>
      <button
        className={`icon-button ${state.repeat !== "off" ? "active-control" : ""}`}
        aria-label={`Repeat: ${state.repeat}. Change repeat mode`}
        onClick={() => dispatch({ type: "repeat" })}
      >
        {state.repeat === "one" ? <Repeat1 size={18} /> : <Repeat size={18} />}
      </button>
    </div>
  );
}
export function Progress({
  state,
  entry,
  dispatch,
}: {
  state: PlayerState;
  entry: PortfolioEntry;
  dispatch: Dispatch<PlayerAction>;
}) {
  return (
    <div className="player-progress">
      <span>{formatTime(state.elapsed)}</span>
      <input
        aria-label={`Seek through ${entry.title}`}
        type="range"
        min="0"
        max={entry.duration}
        step="1"
        value={Math.min(state.elapsed, entry.duration)}
        onChange={(event) =>
          dispatch({
            type: "seek",
            value: Number(event.target.value),
            duration: entry.duration,
          })
        }
      />
      <span>{formatTime(entry.duration)}</span>
    </div>
  );
}
export function PlayerBar({
  state,
  entry,
  dispatch,
  liked,
  onLike,
  onExpand,
  onQueue,
}: {
  state: PlayerState;
  entry: PortfolioEntry;
  dispatch: Dispatch<PlayerAction>;
  liked: boolean;
  onLike: () => void;
  onExpand: () => void;
  onQueue: () => void;
}) {
  return (
    <footer className="player-bar" aria-label="Walkthrough player">
      <div className="now-playing">
        <button
          className="now-art"
          onClick={onExpand}
          aria-label={`Expand ${entry.title}`}
        >
          <Cover entry={entry} />
        </button>
        <button className="now-title" onClick={onExpand}>
          <strong>{entry.title}</strong>
          <span>{entry.subtitle}</span>
        </button>
        <button
          className={`icon-button like-button ${liked ? "active-control" : ""}`}
          aria-label={liked ? "Remove entry from saved" : "Save entry"}
          aria-pressed={liked}
          onClick={onLike}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="player-bar-center">
        <Transport
          state={state}
          dispatch={dispatch}
          duration={entry.duration}
        />
        <Progress state={state} entry={entry} dispatch={dispatch} />
      </div>
      <div className="player-bar-extras">
        <button
          className="icon-button"
          aria-label="Open current playlist"
          onClick={onQueue}
        >
          <ListMusic size={18} />
        </button>
        <button
          className="icon-button"
          aria-label="Open fullscreen player"
          onClick={onExpand}
        >
          <Maximize2 size={18} />
        </button>
      </div>
    </footer>
  );
}
