"use client";

import { useAppSelector } from "@/redux/hooks";
import { getAuth, selectWorkSpaces } from "@/redux/slices/userSlice";
import SideBar from "@/sections/sideBar";
import WorkSpace from "@/sections/workSpace";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Header from "@/sections/header";
import UserMenu from "@/sections/userMenu";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const auth = useAppSelector(getAuth);
  const workSpacesSelected = useAppSelector(selectWorkSpaces);

  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      router.push("/login");
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [auth]);

  let content = auth ? (
    loading ? (
      <Loading />
    ) : (
      <>
        <Header />
        <UserMenu workSpacesSelected={workSpacesSelected} />
        <div
          style={{ height: "calc(100vh - 120px)" }}
          className="flex overflow-x-auto transition-all duration-200 overflow-y-hidden"
        >
          <SideBar />
          <WorkSpace />
        </div>
      </>
    )
  ) : null;
  return <main>{content}</main>;
}
