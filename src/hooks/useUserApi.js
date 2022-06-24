import { useQuery } from "react-query";
import AxiosInstance from "../helpers/axios";

const signUserIn = async (data) => {
    const user_account = await AxiosInstance.post('/users/login', data)

    return user_account
}

export const useLoginQuery = (user_data) => useQuery(["user_account"], signUserIn(user_data))