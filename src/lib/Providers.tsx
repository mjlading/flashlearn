import TrpcProvider from "@/app/api/trpc/TrpcProvider";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <TrpcProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </TrpcProvider>
    </SessionProvider>
  );
}
