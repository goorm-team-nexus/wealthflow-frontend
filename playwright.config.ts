import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./demo-video",
  use: {
    baseURL: "https://d3uib3r331utfe.cloudfront.net",
    viewport: { width: 1280, height: 800 },
    video: {
      mode: "on",
      size: { width: 1280, height: 800 },
    },
    actionTimeout: 10_000,
  },
});
