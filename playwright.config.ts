import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "https://d3uib3r331utfe.cloudfront.net",
    viewport: { width: 390, height: 844 },
    recordVideo: {
      dir: "./demo-video",
      size: { width: 390, height: 844 },
    },
    actionTimeout: 10_000,
  },
});
