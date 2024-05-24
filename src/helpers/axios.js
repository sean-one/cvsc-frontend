import Axios from 'axios';

const baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3333';

const AxiosInstance = Axios.create({
    baseURL: baseURL,
    withCredentials: true,
    method: [ 'GET', 'POST', 'OPTIONS', 'PUT', 'DELETE' ],
});


export default AxiosInstance;