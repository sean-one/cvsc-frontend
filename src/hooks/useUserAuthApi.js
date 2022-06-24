import { useQuery } from "react-query";
import AxiosInstance from "../helpers/axios";

const getUserRoles = async (user_id) => {
    const token = localStorage.getItem('token')

    const user_role_call = await AxiosInstance.get(`/roles/user/${user_id}`, {
        headers: { 'Authorization': 'Bearer ' + token }
    })

    return user_role_call
}

export const useUserRolesQuery = (user_id) => useQuery(["user_roles", user_id], () => getUserRoles(user_id))