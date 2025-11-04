
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

const axiosInstance = axios.create({
  // ✅ Use AllOrigins without encoding the inner slashes
  baseURL: `https://api.allorigins.win/raw?url=${backendURL}`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // ✅ Append endpoint directly (no extra encoding)
    if (config.url && !config.url.startsWith("http")) {
      config.url = `${config.baseURL}${config.url}`;
      config.baseURL = ""; // prevent double baseURL joining
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
