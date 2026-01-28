import axios from "axios";
import Cookies from "js-cookie";
import API_ENDPOINTS from "./endpoints";

const statisticsApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

statisticsApi.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export const statisticsService = {
  getStatistics: async () => {
    try {
      console.log('Fetching statistics from:', API_ENDPOINTS.STATISTICS.GET);
      
      const response = await statisticsApi.get(API_ENDPOINTS.STATISTICS.GET);
      
      console.log('Success! Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }
};