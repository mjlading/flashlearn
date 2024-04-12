import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Flashlearn - Utforsk",
};

export default function ExploreLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex justify-center py-7">
      <main className="max-w-full md:w-[40rem] lg:w-[50rem]">{children}</main>
    </div>
  );
}
