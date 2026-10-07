import type { PersistedState } from "./slices/userSlice";

const STORAGE_KEY = "issue-tracker:state";
const STORAGE_VERSION = 2;

function isPersistedState(value: unknown): value is PersistedState {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.workSpaceId === "string" &&
    typeof v.auth === "boolean" &&
    Array.isArray(v.workSpaces) &&
    Array.isArray(v.columns) &&
    Array.isArray(v.tasks)
  );
}

export function loadState(): PersistedState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== STORAGE_VERSION) return null;
    return isPersistedState(parsed.state) ? parsed.state : null;
  } catch {
    return null;
  }
}

export function saveState(state: PersistedState): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, state })
    );
  } catch {
    // Storage can be full or disabled (private mode); the app keeps working in memory.
  }
}
