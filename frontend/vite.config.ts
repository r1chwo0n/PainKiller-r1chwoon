export default {
  server: {
    proxy: {
      // "/api": {
      //   target: "http://painkiller-backend:3000", // Use Docker service name instead of localhost
      //   changeOrigin: true,
      //   rewrite: (path: any) => path.replace(/^\/api/, "")

      // },
    },
    // host: "0.0.0.0",
    // port: 5173,
    // port: process.env.VITE_PORT || 5173, 
  },
};
