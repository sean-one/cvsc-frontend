import AxiosInstance from '../helpers/axios'
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await AxiosInstance.get('/auth/refresh')
        
        console.log('response in the refresh')
        console.log(response)
        setAuth({ user: response?.data })

        return response.data.accessToken
    }

    return refresh;
}

export default useRefreshToken;