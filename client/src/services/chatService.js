import axiosInstance from "../api/axiosInstance";
import { API_CONFIG } from "../config/api.config";

export const chatService = {
  summarize: async (params = {}) => {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.SUMMARIZE, { params });
    return response;
  },

  transcript: async (params = {}) => {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.TRANSCRIPT, { params });
    return response;
  },

  ask: async (params = {}) => {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.ASK, { params });
    return response;
  }
};