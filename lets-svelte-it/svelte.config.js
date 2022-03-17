import path from "path";
import adapter from "@sveltejs/adapter-auto";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
export const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    paths: { base: "/dns" },

    // Override http methods in the Todo forms
    methodOverride: {
      allowed: ["PATCH", "DELETE"],
    },

    vite: {
      resolve: {
        alias: {
          // these are the aliases and paths to them
          $components: path.resolve("./src/components"),
        },
      },
    },
  },
};

export default config;
