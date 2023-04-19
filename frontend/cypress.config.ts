import { defineConfig } from "cypress";

// @ts-ignore
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      // @ts-ignore
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
