import { useQuery } from "react-query";
import AxiosInstance from "../helpers/axios";

const getAllBusinessRoles = async (id) => {
    const token = localStorage.getItem('token')
    const business_roles = await AxiosInstance.get(`/roles/business/${id}`, { headers: { 'Authorization': 'Bearer ' + token } })

    return business_roles
}

export const useBusinessRolesQuery = (id) => useQuery(['business_roles', id], () => getAllBusinessRoles(id))