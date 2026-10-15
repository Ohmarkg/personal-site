import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createPlayerState,
  formatTime,
  playerReducer,
} from "../lib/player-state.ts";
import { entries, entryById, entriesFor, playlists } from "../lib/portfolio.ts";
const queue = ["about", "work", "project"];
test("new walkthrough starts paused and clamps invalid entry indices", () => {
  assert.equal(createPlayerState(queue, 99).index, 2);
  assert.equal(createPlayerState(queue, -10).index, 0);
  assert.equal(createPlayerState(queue).playing, false);
});
test("selecting another playlist resets progress and starts at the requested entry", () => {
  const next = playerReducer(
    { ...createPlayerState(queue), elapsed: 40 },
    { type: "select", queue: ["health", "shpe"], index: 1, play: true },
  );
  assert.deepEqual(next.queue, ["health", "shpe"]);
  assert.equal(next.index, 1);
  assert.equal(next.elapsed, 0);
  assert.equal(next.playing, true);
});
test("an empty selection cannot replace the current queue", () => {
  const state = createPlayerState(queue);
  assert.equal(
    playerReducer(state, { type: "select", queue: [], index: 0 }),
    state,
  );
});
test("paused walkthrough does not advance", () => {
  const state = createPlayerState(queue);
  assert.equal(playerReducer(state, { type: "tick", duration: 90 }), state);
});
test("playing advances once per tick and goes to the next entry at its end", () => {
  const state = { ...createPlayerState(queue), playing: true, elapsed: 88 };
  const second = playerReducer(state, { type: "tick", duration: 90 });
  assert.equal(second.elapsed, 89);
  const next = playerReducer(second, { type: "tick", duration: 90 });
  assert.equal(next.index, 1);
  assert.equal(next.elapsed, 0);
  assert.equal(next.playing, true);
});
test("end of the final entry stops the walkthrough without wrapping", () => {
  const state = { ...createPlayerState(queue, 2), playing: true, elapsed: 89 };
  const next = playerReducer(state, { type: "tick", duration: 90 });
  assert.equal(next.index, 2);
  assert.equal(next.playing, false);
  assert.equal(next.elapsed, 90);
});
test("play after completion restarts the current entry", () => {
  const state = { ...createPlayerState(queue, 2), elapsed: 90 };
  const next = playerReducer(state, { type: "toggle", duration: 90 });
  assert.equal(next.elapsed, 0);
  assert.equal(next.playing, true);
});
test("repeat all wraps at the end and previous wraps at the beginning", () => {
  const state = {
    ...createPlayerState(queue, 2),
    repeat: "all" as const,
    playing: true,
  };
  const next = playerReducer(state, { type: "next", automatic: true });
  assert.equal(next.index, 0);
  assert.equal(next.playing, true);
  assert.equal(playerReducer(next, { type: "previous" }).index, 2);
});
test("repeat one repeats automatically but manual next still skips", () => {
  const state = {
    ...createPlayerState(queue, 1),
    repeat: "one" as const,
    playing: true,
    elapsed: 89,
  };
  const next = playerReducer(state, { type: "tick", duration: 90 });
  assert.equal(next.index, 1);
  assert.equal(next.elapsed, 0);
  assert.equal(playerReducer(state, { type: "next" }).index, 2);
});
test("shuffle selects another entry and stays in the queue for all random boundaries", () => {
  for (const random of [0, 0.1, 0.5, 0.999999, 1])
    for (const index of [0, 1, 2]) {
      const state = { ...createPlayerState(queue, index), shuffle: true };
      const next = playerReducer(state, { type: "next", random });
      assert.notEqual(next.index, index);
      assert.ok(next.index >= 0 && next.index < queue.length);
    }
});
test("single-entry shuffled playlist completes safely", () => {
  const next = playerReducer(
    {
      ...createPlayerState(["only"]),
      shuffle: true,
      playing: true,
      elapsed: 89,
    },
    { type: "tick", duration: 90 },
  );
  assert.equal(next.index, 0);
  assert.equal(next.playing, false);
});
test("previous restarts after three seconds, otherwise selects the preceding entry", () => {
  const state = { ...createPlayerState(queue, 1), elapsed: 10 };
  const restarted = playerReducer(state, { type: "previous" });
  assert.equal(restarted.index, 1);
  assert.equal(restarted.elapsed, 0);
  assert.equal(playerReducer(restarted, { type: "previous" }).index, 0);
});
test("seeking clamps to the entry duration", () => {
  const state = createPlayerState(queue);
  assert.equal(
    playerReducer(state, { type: "seek", value: -10, duration: 90 }).elapsed,
    0,
  );
  assert.equal(
    playerReducer(state, { type: "seek", value: 999, duration: 90 }).elapsed,
    90,
  );
});
test("repeat button cycles through off, all, one, off", () => {
  let state = createPlayerState(queue);
  for (const expected of ["all", "one", "off"]) {
    state = playerReducer(state, { type: "repeat" });
    assert.equal(state.repeat, expected);
  }
});
test("read times are formatted as minutes and seconds", () => {
  assert.equal(formatTime(0), "0:00");
  assert.equal(formatTime(65), "1:05");
  assert.equal(formatTime(150), "2:30");
});
test("all portfolio entries have unique IDs, real playlists, and usable reading durations", () => {
  assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length);
  for (const entry of entries) {
    assert.ok(playlists.some((list) => list.id === entry.category));
    assert.ok(entry.duration > 0);
    assert.equal(entryById(entry.id), entry);
  }
  for (const playlist of playlists)
    assert.ok(entriesFor(playlist.id).length > 0);
});
