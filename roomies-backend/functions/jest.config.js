// jest.config.ts or jest.config.js
export default {
  testMatch: ["**/tests/**/*.test.ts"],
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json"],
};
