import { defineConfig } from "vite";

export default defineConfig({
  // "./" membuat path file hasil build bersifat relatif,
  // jadi aplikasi bisa ditaruh di folder mana pun (misalnya aldendev.site/tugas/)
  base: "./",
});