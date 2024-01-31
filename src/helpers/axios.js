import Axios from 'axios';

const AxiosInstance = Axios.create({
    withCredentials: true,
    method: [ 'GET', 'POST', 'OPTIONS', 'PUT' ],
});

export default AxiosInstance;