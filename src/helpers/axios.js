import Axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL

const AxiosInstance = Axios.create({
    withCredentials: true,
    baseURL: baseUrl,
    method: [ 'GET', 'POST', 'OPTIONS', 'PUT' ],
});

export default AxiosInstance;