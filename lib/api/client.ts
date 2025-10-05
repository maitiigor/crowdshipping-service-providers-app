import axios from "axios";
import { store } from "../../store";
// API client: base URL and fetch helpers

export const API_BASE_URL = "https://crowdshipping-ruby.vercel.app/api/v1";
export const API_ACCESS_KEY = "TTPK_26369a22-f01f-4dcd-b494-3ac058f9ed19";



let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};


export type Query = Record<
  string,
  string | number | boolean | undefined | null
>;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "x-api-key": API_ACCESS_KEY },
  timeout: 10000,

});

// Add a request interceptor to attach the token
apiClient.interceptors.request.use(
  (config) => {
  
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
     // console.log("token:", authToken);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;