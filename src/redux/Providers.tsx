"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { MotionConfig } from "framer-motion";
import { makeStore } from "./store";
import { hydrate, type PersistedState } from "./slices/userSlice";
import { loadState, saveState } from "./storage";

const SAVE_DELAY_MS = 250;

export default function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    // Restore saved data after mount so server and client markup always match.
    store.dispatch(hydrate(loadState()));

    const pick = (): PersistedState => {
      const { workSpaceId, workSpaces, columns, tasks, auth } =
        store.getState().user;
      return { workSpaceId, workSpaces, columns, tasks, auth };
    };

    let previous = pick();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let dirty = false;

    const flush = () => {
      if (timer) clearTimeout(timer);
      if (!dirty) return;
      dirty = false;
      saveState(pick());
    };

    const unsubscribe = store.subscribe(() => {
      const next = pick();
      const changed =
        next.workSpaceId !== previous.workSpaceId ||
        next.workSpaces !== previous.workSpaces ||
        next.columns !== previous.columns ||
        next.tasks !== previous.tasks ||
        next.auth !== previous.auth;
      if (!changed) return;
      previous = next;
      dirty = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, SAVE_DELAY_MS);
    });

    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      unsubscribe();
      flush();
    };
  }, [store]);

  return (
    <Provider store={store}>
      {/* Respect the OS "reduce motion" setting for every animation. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </Provider>
  );
}
