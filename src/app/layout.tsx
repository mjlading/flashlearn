import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/Providers";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flashlearn: Utforsk og lær noe nytt hver dag",
  description:
    "Bli med i Flashlearn for å oppdage nye læringsmuligheter med våre interaktive flashkort. Perfekt for studenter som ønsker å utvide kunnskapen på en morsom og engasjerende måte.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen antialiased", inter.className)}>
        <Providers>
          {children}
          <Toaster richColors={true} />
        </Providers>
      </body>
    </html>
  );
}
