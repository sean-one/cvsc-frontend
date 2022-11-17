import AxiosInstance from '../helpers/axios'
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth()

    const refresh = async () => {
        const response = await AxiosInstance.get('/auth/refresh')
        console.log('inside refresh function of useRefreshToken')
        console.log(response)
        setAuth(response.data)

        return response.data.accessToken
    }

    return refresh;
}

export default useRefreshToken;