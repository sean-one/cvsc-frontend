import AxiosInstance from '../helpers/axios'
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        const response = await AxiosInstance.get('/auth/refresh')
        
        setAuth({ ...auth, user: response?.data })

        return response.data.accessToken
    }

    return refresh;
}

export default useRefreshToken;