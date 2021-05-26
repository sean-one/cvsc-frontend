import Axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL

const axiosInstance = Axios.create({
    baseURL: baseUrl,
    withCredentials: true
});

export default axiosInstance;