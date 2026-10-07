"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from "@/components/Button";
import Loading from "@/components/loading";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectAuth, selectHydrated, signIn } from "@/redux/slices/userSlice";

// Demo-only credentials: there is no backend in this project.
const DEMO_USERNAME = "test";
const DEMO_PASSWORD = "123456";

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(selectHydrated);
  const auth = useAppSelector(selectAuth);

  const id = useId();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && auth) router.replace("/");
  }, [hydrated, auth, router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    if (username.trim() !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
      setError("Incorrect username or password.");
      return;
    }
    setError("");
    dispatch(signIn());
  }

  function fillDemo() {
    setUsername(DEMO_USERNAME);
    setPassword(DEMO_PASSWORD);
    setError("");
  }

  // Avoid flashing the form for someone who is already signed in.
  if (!hydrated || auth) return <Loading />;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-sm space-y-4">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-xl border border-purple-500/30 bg-zinc-900 p-8 shadow-2xl shadow-purple-900/20"
        >
          <h1 className="text-2xl font-bold">
            <span className="text-purple-400">Log in to</span> Issue Tracker
          </h1>

          <div className="space-y-2">
            <label htmlFor={`${id}-username`} className="text-sm font-medium">
              Username
            </label>
            <input
              id={`${id}-username`}
              name="username"
              type="text"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              className="field"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor={`${id}-password`} className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id={`${id}-password`}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                className="field pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="icon-btn absolute right-1 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <VisibilityOffIcon fontSize="small" />
                ) : (
                  <VisibilityIcon fontSize="small" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p
              id={`${id}-error`}
              role="alert"
              className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <Button type="submit" fullWidth className="py-2.5 text-base">
            Log in
          </Button>
        </form>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-400">
          <p>
            Demo account:{" "}
            <code className="text-zinc-200">{DEMO_USERNAME}</code> /{" "}
            <code className="text-zinc-200">{DEMO_PASSWORD}</code>
          </p>
          <Button variant="ghost" onClick={fillDemo} className="px-3 py-1">
            Fill in
          </Button>
        </div>
      </div>
    </main>
  );
}
