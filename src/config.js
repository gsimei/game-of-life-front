const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
};

console.log(config);

export default config;
