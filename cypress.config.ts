import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "rq9ady",
  chromeWebSecurity: false,
  e2e: {
    baseUrl: "http://localhost:3000",
    experimentalModifyObstructiveThirdPartyCode: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
