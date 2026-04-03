
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});



export default axiosInstance;