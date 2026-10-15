"use client";
import { useEffect, useRef, type Dispatch } from "react";
import { ChevronDown, Heart } from "lucide-react";
import { type PortfolioEntry } from "@/lib/portfolio";
import { type PlayerAction, type PlayerState } from "@/lib/player-state";
import { Cover, EntryContent } from "./shared";
import { Progress, Transport } from "./player-controls";
export function FullscreenPlayer({
  open,
  onClose,
  entry,
  state,
  dispatch,
  liked,
  onLike,
}: {
  open: boolean;
  onClose: () => void;
  entry: PortfolioEntry;
  state: PlayerState;
  dispatch: Dispatch<PlayerAction>;
  liked: boolean;
  onLike: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open || !ref.current) return;
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="fullscreen-player"
      aria-labelledby="fullscreen-title"
      onClose={onClose}
      style={{ "--cover-color": entry.color } as React.CSSProperties}
    >
      <div className="fullscreen-header">
        <button
          autoFocus
          className="icon-button"
          aria-label="Close fullscreen player"
          onClick={onClose}
        >
          <ChevronDown />
        </button>
        <div>
          <p className="eyebrow">PORTFOLIO WALKTHROUGH</p>
          <span>
            {entry.category === "work" ? "Work Experience" : entry.category}
          </span>
        </div>
        <span className="fullscreen-counter">
          {state.index + 1} / {state.queue.length}
        </span>
      </div>
      <div className="fullscreen-body">
        <div className="fullscreen-art">
          <Cover entry={entry} large />
          <div className="fullscreen-track-heading">
            <div>
              <h2 id="fullscreen-title">{entry.title}</h2>
              <p className="muted">{entry.subtitle}</p>
            </div>
            <button
              className={`icon-button ${liked ? "active-control" : ""}`}
              aria-label={liked ? "Remove entry from saved" : "Save entry"}
              aria-pressed={liked}
              onClick={onLike}
            >
              <Heart fill={liked ? "currentColor" : "none"} />
            </button>
          </div>
          <Progress entry={entry} state={state} dispatch={dispatch} />
          <Transport
            state={state}
            dispatch={dispatch}
            duration={entry.duration}
            compact
          />
          <p className="walkthrough-note">A reading walkthrough · no audio</p>
        </div>
        <article className="fullscreen-details">
          <p className="eyebrow">BEHIND THE ENTRY</p>
          <h3>{entry.title}</h3>
          <p className="muted">
            {entry.period}
            {entry.location ? ` · ${entry.location}` : ""}
          </p>
          <EntryContent entry={entry} />
        </article>
      </div>
    </dialog>
  );
}
