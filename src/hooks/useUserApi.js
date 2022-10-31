import { useQuery } from "react-query";
import AxiosInstance from "../helpers/axios";

const getUserProfile = async () => {
    const user_profile = await AxiosInstance.get('/users/get_profile')

    return user_profile
}

const signUserIn = async (data) => {
    const user_account = await AxiosInstance.post('/users/login', data)

    return user_account
}

export const useProfileQuery = () => useQuery(["user"], getUserProfile)
export const useLoginQuery = (user_data) => useQuery(["user_account"], signUserIn(user_data))