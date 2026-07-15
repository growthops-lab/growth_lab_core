import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    passWithNoTests: false,
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  },
});
