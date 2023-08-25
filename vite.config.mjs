import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  base: "/practica-2023",
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
};
