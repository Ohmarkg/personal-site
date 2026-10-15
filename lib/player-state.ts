export type RepeatMode = "off" | "all" | "one";
export interface PlayerState {
  queue: string[];
  index: number;
  playing: boolean;
  elapsed: number;
  shuffle: boolean;
  repeat: RepeatMode;
}
export type PlayerAction =
  | { type: "select"; queue: string[]; index: number; play?: boolean }
  | { type: "toggle"; duration?: number }
  | { type: "seek"; value: number; duration: number }
  | { type: "next"; automatic?: boolean; random?: number }
  | { type: "previous" }
  | { type: "tick"; duration: number; random?: number }
  | { type: "shuffle" }
  | { type: "repeat" };
export function createPlayerState(queue: string[], index = 0): PlayerState {
  return {
    queue,
    index: Math.max(0, Math.min(index, queue.length - 1)),
    playing: false,
    elapsed: 0,
    shuffle: false,
    repeat: "off",
  };
}
export function playerReducer(
  state: PlayerState,
  action: PlayerAction,
): PlayerState {
  switch (action.type) {
    case "select":
      if (!action.queue.length) return state;
      return {
        ...state,
        queue: action.queue,
        index: Math.max(0, Math.min(action.index, action.queue.length - 1)),
        elapsed: 0,
        playing: action.play ?? false,
      };
    case "toggle":
      return {
        ...state,
        playing: !state.playing,
        elapsed:
          action.duration && state.elapsed >= action.duration
            ? 0
            : state.elapsed,
      };
    case "seek":
      return {
        ...state,
        elapsed: Math.max(0, Math.min(action.value, action.duration)),
      };
    case "shuffle":
      return { ...state, shuffle: !state.shuffle };
    case "repeat":
      return {
        ...state,
        repeat:
          state.repeat === "off"
            ? "all"
            : state.repeat === "all"
              ? "one"
              : "off",
      };
    case "previous":
      if (state.elapsed > 3) return { ...state, elapsed: 0 };
      return {
        ...state,
        index:
          state.index > 0
            ? state.index - 1
            : state.repeat === "all"
              ? state.queue.length - 1
              : 0,
        elapsed: 0,
      };
    case "next": {
      if (action.automatic && state.repeat === "one")
        return { ...state, elapsed: 0 };
      if (state.shuffle && state.queue.length > 1) {
        // Select from all other entries, ensuring shuffle never repeats the current entry.
        const offset =
          1 +
          Math.floor(
            Math.max(0, Math.min(action.random ?? 0, 0.999999)) *
              (state.queue.length - 1),
          );
        return {
          ...state,
          index: (state.index + offset) % state.queue.length,
          elapsed: 0,
        };
      }
      if (state.index + 1 < state.queue.length)
        return { ...state, index: state.index + 1, elapsed: 0 };
      if (state.repeat === "all") return { ...state, index: 0, elapsed: 0 };
      return {
        ...state,
        playing: false,
        elapsed: action.automatic ? state.elapsed : 0,
      };
    }
    case "tick": {
      if (!state.playing) return state;
      if (state.elapsed + 1 >= action.duration)
        return playerReducer(
          { ...state, elapsed: action.duration },
          { type: "next", automatic: true, random: action.random },
        );
      return { ...state, elapsed: state.elapsed + 1 };
    }
  }
}
export function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
