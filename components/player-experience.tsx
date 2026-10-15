"use client";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Github,
  Heart,
  House,
  Library,
  ListMusic,
  Pause,
  Play,
  Search,
  X,
} from "lucide-react";
import {
  entries,
  entriesFor,
  entryById,
  playlists,
  profile,
  type Category,
  type PortfolioEntry,
} from "@/lib/portfolio";
import {
  createPlayerState,
  formatTime,
  playerReducer,
} from "@/lib/player-state";
import { Cover, EntryContent } from "./shared";
import { PlayerBar } from "./player-controls";
import { FullscreenPlayer } from "./fullscreen-player";

type View = Category | "home" | "saved" | "search";
export default function PlayerExperience() {
  const params = useSearchParams();
  const initialEntry = entryById(params.get("entry") ?? "");
  const initialPlaylist =
    playlists.find((item) => item.id === params.get("playlist"))?.id ?? "about";
  const initialCategory = initialEntry?.category ?? initialPlaylist;
  const initialQueue = entriesFor(initialCategory);
  const [state, dispatch] = useReducer(playerReducer, undefined, () =>
    createPlayerState(
      initialQueue.map((item) => item.id),
      Math.max(
        0,
        initialQueue.findIndex((item) => item.id === initialEntry?.id),
      ),
    ),
  );
  const [history, setHistory] = useState<{ views: View[]; index: number }>({
    views: [initialCategory],
    index: 0,
  });
  const view = history.views[history.index];
  const [fullscreen, setFullscreen] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);
  const [likesReady, setLikesReady] = useState(false);
  const [query, setQuery] = useState("");
  const titleRef = useRef<HTMLHeadingElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();
  const current = entryById(state.queue[state.index]) ?? entries[0];
  const currentRef = useRef(current);
  currentRef.current = current;
  const navigate = useCallback((next: View) => {
    setHistory((previous) =>
      previous.views[previous.index] === next
        ? previous
        : {
            views: [...previous.views.slice(0, previous.index + 1), next],
            index: previous.index + 1,
          },
    );
  }, []);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem("mark-portfolio-saved") ?? "[]",
      );
      if (Array.isArray(saved))
        setLiked(
          saved.filter(
            (id): id is string => typeof id === "string" && !!entryById(id),
          ),
        );
    } catch {
      /* Storage is optional in private browsing. */
    }
    setLikesReady(true);
  }, []);
  useEffect(() => {
    if (likesReady) {
      try {
        localStorage.setItem("mark-portfolio-saved", JSON.stringify(liked));
      } catch {
        /* Continue without persistence when storage is unavailable. */
      }
    }
  }, [liked, likesReady]);
  const toggleLike = useCallback(
    (id: string) =>
      setLiked((previous) =>
        previous.includes(id)
          ? previous.filter((item) => item !== id)
          : [...previous, id],
      ),
    [],
  );
  useEffect(() => {
    if (!state.playing) return;
    const timer = window.setInterval(
      () =>
        dispatch({
          type: "tick",
          duration: currentRef.current.duration,
          random: Math.random(),
        }),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [state.playing]);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (
        event.altKey ||
        event.metaKey ||
        event.ctrlKey ||
        target.closest(
          'input,textarea,select,button,a,[contenteditable="true"]',
        )
      )
        return;
      if (event.code === "Space") {
        event.preventDefault();
        dispatch({ type: "toggle", duration: currentRef.current.duration });
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        dispatch({ type: "next", random: Math.random() });
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        dispatch({ type: "previous" });
      }
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        setFullscreen((previous) => !previous);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const lastView = useRef(view);
  useEffect(() => {
    if (lastView.current !== view) {
      if (view === "search") searchRef.current?.focus();
      else titleRef.current?.focus();
      lastView.current = view;
    }
  }, [view]);
  const playlist = playlists.find((item) => item.id === view);
  const visibleEntries =
    view === "saved"
      ? entries.filter((item) => liked.includes(item.id))
      : view === "search"
        ? entries.filter((item) =>
            `${item.title} ${item.subtitle} ${item.summary} ${item.tags.join(" ")}`
              .toLowerCase()
              .includes(query.trim().toLowerCase()),
          )
        : playlist
          ? entriesFor(playlist.id)
          : entries;
  const selectEntry = (
    entry: PortfolioEntry,
    collection: PortfolioEntry[] = visibleEntries,
  ) => {
    const queue = collection.length ? collection : entriesFor(entry.category);
    dispatch({
      type: "select",
      queue: queue.map((item) => item.id),
      index: queue.findIndex((item) => item.id === entry.id),
      play: true,
    });
  };
  const storyEntry =
    visibleEntries.find((item) => item.id === current.id) ?? visibleEntries[0];
  const title =
    playlist?.title ??
    (view === "saved"
      ? "Saved Entries"
      : view === "search"
        ? "Search the portfolio"
        : "Made to explore");
  return (
    <div className="player-shell">
      <a className="skip-link" href="#player-content">
        Skip to playlist
      </a>
      <aside className="player-sidebar" aria-label="Player navigation">
        <Link href="/" className="player-brand">
          <span className="monogram">MG</span>
          <span>
            Mark Gonzalez<small>THE PORTFOLIO</small>
          </span>
        </Link>
        <nav aria-label="Player views">
          <button
            className={
              view === "home" ? "sidebar-link selected" : "sidebar-link"
            }
            onClick={() => navigate("home")}
          >
            <House size={21} />
            Home
          </button>
          <button
            className={
              view === "search" ? "sidebar-link selected" : "sidebar-link"
            }
            onClick={() => navigate("search")}
          >
            <Search size={21} />
            Search
          </button>
        </nav>
        <div className="library-heading">
          <Library size={20} />
          <span>Your Library</span>
        </div>
        <button
          className={
            view === "saved" ? "sidebar-link selected" : "sidebar-link"
          }
          onClick={() => navigate("saved")}
        >
          <Heart size={19} />
          Saved Entries <small>{liked.length}</small>
        </button>
        <div className="sidebar-playlists">
          {playlists.map((item) => (
            <button
              key={item.id}
              className={`sidebar-playlist ${view === item.id ? "selected" : ""}`}
              onClick={() => navigate(item.id)}
            >
              <Cover entry={{ ...item, title: item.title }} />
              <span>
                {item.title}
                <small>
                  Playlist · {entriesFor(item.id).length}{" "}
                  {entriesFor(item.id).length === 1 ? "entry" : "entries"}
                </small>
              </span>
              {state.playing && current.category === item.id && (
                <span
                  className="playing-indicator"
                  aria-label="Currently playing"
                >
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="sidebar-bottom">
          <p>
            This is a portfolio.
            <br />
            The work is the playlist.
          </p>
          <Link href="/" className="button button-outline">
            <ArrowLeft size={16} />
            Standard Portfolio
          </Link>
        </div>
      </aside>
      <div className="player-main-column">
        <header className="player-topbar">
          <div className="player-history">
            <button
              className="icon-button"
              aria-label="Go back in player"
              disabled={history.index === 0}
              onClick={() =>
                setHistory((previous) => ({
                  ...previous,
                  index: previous.index - 1,
                }))
              }
            >
              <ChevronLeft />
            </button>
            <button
              className="icon-button"
              aria-label="Go forward in player"
              disabled={history.index === history.views.length - 1}
              onClick={() =>
                setHistory((previous) => ({
                  ...previous,
                  index: previous.index + 1,
                }))
              }
            >
              <ChevronRight />
            </button>
          </div>
          <p className="player-topbar-label">A portfolio, on your terms.</p>
          <Link href="/" className="button button-outline">
            <ArrowLeft size={15} />
            <span>Standard Portfolio</span>
          </Link>
        </header>
        <main id="player-content" className="player-content" tabIndex={-1}>
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={view}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, position: "absolute", pointerEvents: "none" }}
              transition={{ duration: 0.18 }}
            >
              {view === "home" ? (
                <>
                  <section className="player-welcome">
                    <p className="eyebrow">
                      MARK GONZALEZ · SOFTWARE DEVELOPER
                    </p>
                    <h1 ref={titleRef} tabIndex={-1}>
                      Made to explore.
                    </h1>
                    <p>
                      Production development, mobile applications, and technical
                      teaching. Pick a playlist and get to know my work.
                    </p>
                    <button
                      className="button button-green"
                      onClick={() => {
                        navigate("about");
                        selectEntry(entries[0], entriesFor("about"));
                      }}
                    >
                      <Play size={18} fill="currentColor" />
                      Start with About
                    </button>
                  </section>
                  <div className="section-heading">
                    <h2>The portfolio playlists</h2>
                    <span className="muted">Pick your starting point</span>
                  </div>
                  <div className="playlist-grid">
                    {playlists.map((item) => (
                      <button
                        className="playlist-card"
                        key={item.id}
                        onClick={() => navigate(item.id)}
                      >
                        <Cover entry={item} large />
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <span className="playlist-card-play">
                          <Play size={20} fill="currentColor" />
                        </span>
                      </button>
                    ))}
                  </div>
                  <section className="player-home-about">
                    <p className="eyebrow">BEHIND THE WORK</p>
                    <h2>Software with a practical purpose.</h2>
                    <p className="muted">{profile.bio}</p>
                    <a
                      className="text-link"
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={17} />
                      Find me on GitHub <ArrowUpRight size={15} />
                    </a>
                  </section>
                </>
              ) : (
                <>
                  <section
                    className={`playlist-hero ${view === "search" ? "search-hero" : ""}`}
                    style={
                      {
                        "--playlist-color": playlist?.color ?? "#2c2149",
                      } as React.CSSProperties
                    }
                  >
                    {view !== "search" && (
                      <Cover
                        entry={{
                          title,
                          monogram: playlist?.monogram ?? "♥",
                          color: playlist?.color ?? "#443273",
                        }}
                        large
                      />
                    )}
                    <div>
                      <p className="eyebrow">
                        {view === "search"
                          ? "FIND YOUR NEXT ENTRY"
                          : "PORTFOLIO PLAYLIST"}
                      </p>
                      <h1 ref={titleRef} tabIndex={-1}>
                        {title}
                      </h1>
                      <p className="playlist-description">
                        {playlist?.description ??
                          (view === "saved"
                            ? "The entries you want to come back to. Saved on this browser."
                            : "Find experiences, projects, and technologies.")}
                      </p>
                      {view !== "search" && (
                        <p className="playlist-meta">
                          <span className="tiny-avatar">MG</span>
                          <strong>Mark Gonzalez</strong>
                          <span>
                            · {visibleEntries.length}{" "}
                            {visibleEntries.length === 1 ? "entry" : "entries"}
                          </span>
                          <span>
                            ·{" "}
                            {formatTime(
                              visibleEntries.reduce(
                                (sum, item) => sum + item.duration,
                                0,
                              ),
                            )}{" "}
                            walkthrough
                          </span>
                        </p>
                      )}
                      {view === "search" && (
                        <div className="search-field">
                          <Search size={21} />
                          <input
                            ref={searchRef}
                            aria-label="Search portfolio entries"
                            placeholder="What would you like to explore?"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                          />
                          {query && (
                            <button
                              className="icon-button"
                              aria-label="Clear search"
                              onClick={() => {
                                setQuery("");
                                searchRef.current?.focus();
                              }}
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </section>
                  {visibleEntries.length > 0 ? (
                    <>
                      <div className="playlist-toolbar">
                        <button
                          className="play-button"
                          aria-label={`Play ${title} playlist`}
                          onClick={() => selectEntry(visibleEntries[0])}
                        >
                          <Play size={24} fill="currentColor" />
                        </button>
                        <p>
                          Explore at your own pace.
                          <small>
                            Play to advance automatically, or select any entry.
                          </small>
                        </p>
                        <ListMusic className="muted" size={20} />
                      </div>
                      <div
                        className="track-list"
                        role="list"
                        aria-label={`${title} entries`}
                      >
                        <div className="track-table-heading" aria-hidden="true">
                          <span>#</span>
                          <span>Title</span>
                          <span>Period</span>
                          <span>Read time</span>
                        </div>
                        {visibleEntries.map((entry, index) => (
                          <div
                            className={`track-row ${current.id === entry.id ? "current-track" : ""}`}
                            key={entry.id}
                            role="listitem"
                          >
                            <button
                              className="track-select"
                              onClick={() => {
                                if (current.id === entry.id)
                                  dispatch({
                                    type: "toggle",
                                    duration: currentRef.current.duration,
                                  });
                                else selectEntry(entry);
                              }}
                              aria-label={`${current.id === entry.id && state.playing ? "Pause" : "Play"} ${entry.title}`}
                            >
                              <span className="track-number">
                                {current.id === entry.id && state.playing ? (
                                  <Pause size={16} />
                                ) : (
                                  index + 1
                                )}
                              </span>
                              <span className="track-title">
                                <Cover entry={entry} />
                                <span>
                                  <strong>{entry.title}</strong>
                                  <small>{entry.subtitle}</small>
                                </span>
                              </span>
                              <span className="track-period">
                                {entry.period}
                              </span>
                              <span className="track-time">
                                {formatTime(entry.duration)}
                              </span>
                            </button>
                            <button
                              className={`icon-button track-save ${liked.includes(entry.id) ? "active-control" : ""}`}
                              aria-label={`${liked.includes(entry.id) ? "Unsave" : "Save"} ${entry.title}`}
                              aria-pressed={liked.includes(entry.id)}
                              onClick={() => toggleLike(entry.id)}
                            >
                              <Heart
                                size={17}
                                fill={
                                  liked.includes(entry.id)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>
                            <button
                              className="track-details-button"
                              onClick={() => {
                                dispatch({
                                  type: "select",
                                  queue: visibleEntries.map((item) => item.id),
                                  index,
                                  play: state.playing,
                                });
                                setFullscreen(true);
                              }}
                              aria-label={`Read ${entry.title} details`}
                            >
                              Details <ArrowUpRight size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <section className="playlist-story">
                        <p className="eyebrow">
                          {storyEntry?.id === current.id
                            ? "NOW EXPLORING"
                            : "FROM THIS PLAYLIST"}
                        </p>
                        <h2>{storyEntry.title}</h2>
                        <p className="muted">{storyEntry.subtitle}</p>
                        <EntryContent entry={storyEntry} />
                        <button
                          className="text-link"
                          onClick={() => {
                            if (storyEntry.id !== current.id)
                              dispatch({
                                type: "select",
                                queue: visibleEntries.map((item) => item.id),
                                index: 0,
                              });
                            setFullscreen(true);
                          }}
                        >
                          Open fullscreen player <ArrowUpRight size={16} />
                        </button>
                      </section>
                    </>
                  ) : (
                    <div className="player-empty">
                      <Search size={36} />
                      <h2>
                        {view === "saved"
                          ? "Keep your favorites close."
                          : "No entries found."}
                      </h2>
                      <p>
                        {view === "saved"
                          ? "Use the heart beside an entry to save it here."
                          : "Try a technology, company, or project name."}
                      </p>
                      <button
                        className="button button-outline"
                        onClick={() => navigate("home")}
                      >
                        Explore playlists
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="player-content-footer">
            <span>© {new Date().getFullYear()} Mark Gonzalez</span>
            <span>Space: play / pause · ← →: skip · F: fullscreen</span>
          </div>
        </main>
      </div>
      <nav className="mobile-player-nav" aria-label="Mobile player navigation">
        <button
          aria-current={view === "home" ? "page" : undefined}
          onClick={() => navigate("home")}
        >
          <House size={19} />
          Home
        </button>
        <button
          aria-current={view === "search" ? "page" : undefined}
          onClick={() => navigate("search")}
        >
          <Search size={19} />
          Search
        </button>
        <button
          aria-current={view === "work" ? "page" : undefined}
          onClick={() => navigate("work")}
        >
          <Library size={19} />
          Work
        </button>
        <button
          aria-current={view === "projects" ? "page" : undefined}
          onClick={() => navigate("projects")}
        >
          <ListMusic size={19} />
          Projects
        </button>
        <button
          aria-current={view === "saved" ? "page" : undefined}
          onClick={() => navigate("saved")}
        >
          <Heart size={19} />
          Saved
        </button>
      </nav>
      <PlayerBar
        state={state}
        dispatch={dispatch}
        entry={current}
        liked={liked.includes(current.id)}
        onLike={() => toggleLike(current.id)}
        onExpand={() => setFullscreen(true)}
        onQueue={() => navigate(current.category)}
      />
      <FullscreenPlayer
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        state={state}
        dispatch={dispatch}
        entry={current}
        liked={liked.includes(current.id)}
        onLike={() => toggleLike(current.id)}
      />
      <span className="sr-only" role="status" aria-live="polite">
        {current.title} — {current.subtitle}
      </span>
    </div>
  );
}
