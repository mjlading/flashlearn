"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { PropsWithChildren, useState } from "react";
import { api } from "./client";

const TRPC_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.flashlearn.no/api/trpc"
    : "http://localhost:3000/api/trpc";

export default function TrpcProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: TRPC_API_URL,
        }),
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
      ],
    })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </api.Provider>
    </QueryClientProvider>
  );
}
