import Navbar from "@/components/Navbar";
import { PropsWithChildren } from "react";

export default function WithNavbarLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
