import AxiosInstance from '../helpers/axios'
import useAuth from './useAuth';

const useRefreshToken = () => {
    console.log('inside useRefreshToken hook')
    const { setAuth } = useAuth()

    const refresh = async () => {
        const response = await AxiosInstance.get('/auth/refresh')

        setAuth(response.data)

        return response.data.accessToken
    }

    return refresh;
}

export default useRefreshToken;