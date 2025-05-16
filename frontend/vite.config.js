import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // https: {
    //   key: fs.readFileSync("./certs/key.pem"),
    //   cert: fs.readFileSync("./certs/cert.pem"),
    // },
    // host: "192.168.56.1",
    // port: 5173,
    host: true,
  },
});
