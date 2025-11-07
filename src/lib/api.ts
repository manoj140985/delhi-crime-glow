// API Configuration
// Change this to match your Flask backend URL
export const API_BASE_URL = "http://127.0.0.1:5000";

export const API_ENDPOINTS = {
  crimes: `${API_BASE_URL}/crimes`,
  predict: (crime: string, year: number) => 
    `${API_BASE_URL}/predict?crime=${encodeURIComponent(crime)}&year=${year}`,
  predictGraph: (crime: string, year: number) => 
    `${API_BASE_URL}/predict/graph?crime=${encodeURIComponent(crime)}&year=${year}`,
};
