import AxiosInstance from '../helpers/axios'
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await AxiosInstance.get('/auth/refresh')
        
        setAuth({ user: response?.data, isLoggedIn: true })

        return response.data.user.accessToken
    }

    return refresh;
}

export default useRefreshToken;