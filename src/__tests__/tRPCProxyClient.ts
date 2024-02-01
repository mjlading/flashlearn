import { AppRouter, appRouter } from "@/server/routers";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

const testProxy = createTRPCProxyClient<AppRouter>({
  links: [
      httpBatchLink({
          url: "http://localhost:3000/api/trpc" 
      })
  ]
});
export default testProxy