
// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "https://corsproxy.io/?http://184.73.8.191:8000/api",
// });


// // Request interceptor: attach access token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken"); 
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor: handle 401 (access token expired)
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const refreshToken = localStorage.getItem("refreshToken");
//       if (refreshToken) {
//         try {
//           const res = await axios.post("http://184.73.8.191:8000/api/token/refresh/", {
//             refresh: refreshToken,
//           });
//           localStorage.setItem("accessToken", res.data.access); 
//           originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
//           return axiosInstance(originalRequest);
//         } catch (err) {
//           console.error("Refresh token failed", err);
       
//           localStorage.removeItem("accessToken");
//           localStorage.removeItem("refreshToken"); 
//           window.location.href = "/login";
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


// import axios from "axios";

// const BASE_URL = "https://api.allorigins.win/raw?url=http://184.73.8.191:8000/api";

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
// });

// // Request interceptor: attach access token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );



// // Response interceptor: handle 401 (access token expired)
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const refreshToken = localStorage.getItem("refreshToken");
//       if (refreshToken) {
//         try {
//           const res = await axios.post(`${BASE_URL}/token/refresh/`, {
//             refresh: refreshToken,
//           });
//           localStorage.setItem("accessToken", res.data.access);
//           originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
//           return axiosInstance(originalRequest);
//         } catch (err) {
//           console.error("Refresh token failed", err);
//           localStorage.removeItem("accessToken");
//           localStorage.removeItem("refreshToken");
//           window.location.href = "/login";
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

import axios from "axios";

const backendURL = "http://184.73.8.191:8000/api";

// Function to build encoded full URL for AllOrigins
const getEncodedURL = (endpoint) => {
  const fullUrl = `${backendURL}${endpoint}`;
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(fullUrl)}`;
};

// Create axios instance (no baseURL)
const axiosInstance = axios.create();

// ✅ Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    // Replace config.url with full encoded AllOrigins URL
    if (!config.url.startsWith("http")) {
      config.url = getEncodedURL(config.url);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor (for token refresh)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post(`${backendURL}/token/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem("accessToken", res.data.access);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          console.error("Refresh token failed", err);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
