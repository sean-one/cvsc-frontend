import { useQuery } from "react-query";
import AxiosInstance from "../helpers/axios";

const getUserRoles = async (user_id) => {
    if (user_id) {
        const token = localStorage.getItem('token')
    
        const user_role_call = await AxiosInstance.get(`/roles/user/${user_id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
    
        return user_role_call
    } else {
        // should throw an error for user_id being undefined
        return []
    }
}

export const useUserRolesQuery = (user_id) => useQuery(["user_roles", user_id], () => getUserRoles(user_id))