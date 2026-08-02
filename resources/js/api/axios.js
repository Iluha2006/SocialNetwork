
import axios from 'axios';

const STORAGE_HOSTS = [
    'http://storage:9000',
    'https://storage:9000',
    'http://localhost:9000',
    'https://localhost:9000',
    'storage:9000',
];

function normalizeUrl(url) {
    if (typeof url !== 'string') return url;
    for (const host of STORAGE_HOSTS) {
        if (url.startsWith(host)) {
            return url.slice(host.length) || '/social-media/';
        }
    }
    return url;
}

function normalizeUrls(obj) {
    if (typeof obj === 'string') return normalizeUrl(obj);
    if (Array.isArray(obj)) return obj.map(normalizeUrls);
    if (obj && typeof obj === 'object') {
        const result = {};
        for (const key of Object.keys(obj)) {
            result[key] = normalizeUrls(obj[key]);
        }
        return result;
    }
    return obj;
}

const axiosInstance = axios.create({
  baseURL: '',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = normalizeUrls(response.data);
    }
    return response;
  },
  (error) => Promise.reject(error)
);


export default axiosInstance;