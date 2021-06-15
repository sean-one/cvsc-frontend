import Axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL
const token = localStorage.getItem('token');

const axiosInstance = Axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {'Authorization': 'Bearer '+token}
});


export default axiosInstance;