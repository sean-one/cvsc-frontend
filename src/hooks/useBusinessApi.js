import { useQuery } from "react-query";
import AxiosInstance from "../helpers/axios";

const getAllBusinesses = async () => {
    const businesses_api_call = await AxiosInstance.get('/business')
    
    return businesses_api_call
}

const getBusiness = async (id) => {
    const single_business = await AxiosInstance.get(`/business/${id}`)
    
    return single_business
}

export const createBusiness = async (business) => {
    const token = localStorage.getItem('token')
    const new_business = await AxiosInstance.post('/business/create', business, { headers: { 'Authorization': 'Bearer ' + token } })

    return new_business
}

const getAllBusinessRoles = async (id) => {
    const token = localStorage.getItem('token')
    const business_roles = await AxiosInstance.get(`/roles/business/${id}`, { headers: { 'Authorization': 'Bearer ' + token } })

    return business_roles
}


export const useBusinessesQuery = () => useQuery(["businesses"], getAllBusinesses, { refetchOnMount: false })
export const useBusinessQuery = (id) => useQuery(["business", id], () => getBusiness(id))
export const useBusinessRolesQuery = (id) => useQuery(['business_roles', id], () => getAllBusinessRoles(id))
