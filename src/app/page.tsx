"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { useAppSelector } from "@/redux/hooks";
import { selectAuth, selectHydrated } from "@/redux/slices/userSlice";
import BoardToolbar from "@/sections/boardToolbar";
import Header from "@/sections/header";
import SideBar from "@/sections/sideBar";
import WorkSpace from "@/sections/workSpace";

export default function Home() {
  const router = useRouter();
  const hydrated = useAppSelector(selectHydrated);
  const auth = useAppSelector(selectAuth);

  // Wait for saved data to load before deciding whether the user is signed in.
  useEffect(() => {
    if (hydrated && !auth) router.replace("/login");
  }, [hydrated, auth, router]);

  if (!hydrated || !auth) return <Loading />;

  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">
        <SideBar />
        <main className="flex min-w-0 flex-1 flex-col">
          <BoardToolbar />
          <WorkSpace />
        </main>
      </div>
    </div>
  );
}
