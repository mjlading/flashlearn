import TrpcProvider from "@/app/api/trpc/TrpcProvider";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { dictType } from "@/app/dictionaries/dictionariesClientSide";
import DictProvider from "./DictProvider";

interface PropsWithChildrenAndDict extends PropsWithChildren {
  dict:dictType
}

export default function Providers({ dict, children, }: PropsWithChildrenAndDict) {
  return (
    <SessionProvider>
      <TrpcProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DictProvider dict={dict}>
            {children}
          </DictProvider>
        </ThemeProvider>
      </TrpcProvider>
    </SessionProvider>
  );
}
