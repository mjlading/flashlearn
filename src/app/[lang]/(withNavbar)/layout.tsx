import { getDictionary } from "@/app/dictionaries/dictionaries";
import Navbar from "@/components/Navbar";
import { PropsWithChildren } from "react";
import { Locale } from "@/../i18n-config";

interface PropsWithChildrenAndDict extends PropsWithChildren {
  params:{lang:Locale}
}

export default async function WithNavbarLayout({ params:{lang}, children }: PropsWithChildrenAndDict) {
  const dict = await getDictionary(lang);
  return (
    <>
      <Navbar dict={dict}/>
      {children}
    </>
  );
}
