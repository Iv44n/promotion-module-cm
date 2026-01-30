// src/api/axios.ts
import axios from "axios";

// Usamos tu link de devtunnels como base
const API_URL = "https://ptzsk572-3000.brs.devtunnels.ms/api";

export const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// (Mantén tus interceptors si los tenías)
api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("API Error:", error.response?.data || error.message);
		return Promise.reject(error);
	},
);
