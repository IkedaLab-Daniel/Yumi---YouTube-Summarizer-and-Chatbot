export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5001',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-type': 'application/json',
    'Accept': 'application/json'
  },
  ENDPOINTS: {
    HEALTH: "/health",
    TRANSCRIPT: "/transcript",
    SUMMARIZE: "/summarize",
    ASK: "/ask",
  },
};

// > Environment-specific configuration
export const ENV = {
    isDevelopment: import.meta.env.MODE == 'development',
    isProduction: import.meta.env.MODE == 'production',
};