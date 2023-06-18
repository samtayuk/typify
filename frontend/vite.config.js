import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
	import { ViteWebfontDownload } from "vite-plugin-webfont-dl";

export default defineConfig(() => {
  return {
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:5000",
          changeOrigin: true,
        },
      },
    },

    build: {
      outDir: "build",
    },

    theme: {
      extend: {
        fontFamily: {
          sans: ["Tsukimi Rounded", "Lato", "sans-serif"],
        },
      },
    },

    plugins: [
      react(),
      ViteWebfontDownload([
        "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Tsukimi+Rounded:wght@300;400;500&display=swap",
      ]),
    ],
  };
});
