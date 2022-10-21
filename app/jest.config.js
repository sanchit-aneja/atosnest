module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["./config/jest.config.ts"],
  testPathIgnorePatterns: ["/utils/database.ts", "/node_modules/*", "/dist/"],
};
