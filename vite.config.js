import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@react-three/fiber": "node_modules/@react-three/fiber",
    },
  },
});
