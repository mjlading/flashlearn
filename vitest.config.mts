import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" }); // this prevents local running from wiping database

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    setupFiles: ["/src/__tests__/setup.ts"],
    globals: true,
    poolOptions: {
      threads: { singleThread: true },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
