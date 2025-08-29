import axios from "axios";
import { getTokenData } from "./Utils";

const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});


apiService.interceptors.request.use(
  (config) => { return config; },
  (error) => {
    const errorMessage = error?.message || "Request error occurred";
    return Promise.reject(error instanceof Error ? error : new Error(errorMessage));
  }
);

// Response Interceptor
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!(error instanceof Error)) {
      const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
      return Promise.reject(new Error(errorMessage));
    }

    if (error?.response?.data?.message) {
      console.error(error.response.data.message);
    }

    return Promise.reject(error);
  }
);

const post_data = (endpoint, data, _headers) => {
  let hdrs = {
    'Content-Type': 'application/json',
    'client_id': import.meta.env.VITE_CLIENT_ID,
    'client_secret': import.meta.env.VITE_CLIENT_SECRET
  };
  if (_headers) {
    try {
      Object.entries(_headers).forEach(([key, value]) => {
        hdrs[key] = value;
      });
    } catch (_) {
      console.log(_)
      return
    }
  }
  return apiService.post(endpoint, data, { headers: hdrs });
};
const post_auth_data = (endpoint, data, _headers) => {
  let hdrs = {
    'Content-Type': 'application/json',
    'client_id': import.meta.env.VITE_CLIENT_ID,
    'client_secret': import.meta.env.VITE_CLIENT_SECRET,
    "jwt_token": getTokenData()?.jwt_token
  };
  if (_headers) {
    try {
      Object.entries(_headers).forEach(([key, value]) => {
        hdrs[key] = value;
      });
    } catch (_) {
      console.log(_)
      return
    }
  }
  return apiService.post(endpoint, data, { headers: hdrs });
};
const post_data_email = (endpoint, data, _headers) => {
  let hdrs = {
    'Content-Type': 'application/json',
    'client_id': import.meta.env.VITE_CLIENT_ID,
    'client_secret': import.meta.env.VITE_CLIENT_SECRET
  };
  if (_headers) {
    try {
      Object.entries(_headers).forEach(([key, value]) => {
        hdrs[key] = value;
      });
    } catch (_) {
      console.log(_)
      return
    }
  }
  return apiService.post(endpoint, JSON.parse(data), { headers: hdrs });
};


export {
  post_data,
  post_data_email,
  post_auth_data
};