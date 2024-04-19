import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "@/lib/Providers";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Locale } from "@/../i18n-config";
import { getDictionary } from "../dictionaries/dictionaries";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flashlearn: Utforsk og lær noe nytt hver dag",
  description:
    "Bli med i Flashlearn for å oppdage nye læringsmuligheter med våre interaktive flashkort. Perfekt for studenter som ønsker å utvide kunnskapen på en morsom og engasjerende måte.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params:{lang:Locale}
}>) {
  
  const dict = await getDictionary(params.lang)
  

  return (
    <html lang="en">
      <body className={cn("min-h-screen antialiased", inter.className)}>
        <Providers dict={dict /* drilling time */}> 
          {children}
          <Toaster richColors={true} />
        </Providers>
      </body>
    </html>
  );
}
