import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SignIn from "./auth/signin/page";

export const metadata: Metadata = {
  title:
    "Health Hub Ethiopia Main Site",
  description: "This is Next.js Home for Health Hub Ethiopia",
};

export default function Home() {
  return (
    <>
      <SignIn />
    </>
  );
}
