import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    headless: true,
  },
  // webServer: {
  //   command: "vite preview",
  //   port: 4173,
  //   timeout: 120000,
  //   reuseExistingServer: !process.env.CI,
  // },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
});
