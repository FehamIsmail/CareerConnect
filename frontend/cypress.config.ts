import { defineConfig } from "cypress";

// @ts-ignore
export default defineConfig({
  component: {
    video: false,
    devServer: {
      // @ts-ignore
      framework: "create-react-app",
      bundler: "webpack",
      baseUrl: "http://localhost:3000",
    },
  },
});
