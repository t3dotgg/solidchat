import solid from "solid-start";
import { defineConfig } from "vite";

import vercel from "solid-start-vercel";

export default defineConfig({
  plugins: [
    solid({
      ssr: false,
      adapter: vercel(),
    }),
  ],
});
