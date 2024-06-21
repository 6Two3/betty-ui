import { headers } from "next/headers";
import HomeView from "@/views/home/index";

export default function Home() {
  headers();

  return (
    <>
      <HomeView />
    </>
  );
}
