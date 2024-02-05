/**
 * Import api from this file to use the tRPC API in client components.
 */

import { type AppRouter } from "@/server/routers";
import { createTRPCReact } from "@trpc/react-query";

export const api = createTRPCReact<AppRouter>();
