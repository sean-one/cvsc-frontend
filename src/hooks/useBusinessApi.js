import { useMutation, useQuery } from "react-query";
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

export const upgradeCreator = async (role_id) => {
    const token = localStorage.getItem('token')
    const new_manager = await AxiosInstance.post(`/roles/upgrade/creator/${role_id}`, { headers: { 'Authorization': 'Bearer ' + token } })

    return new_manager
}

export const approveBusinessRole = async (role_id) => {
    const token = localStorage.getItem('token')
    const new_creator = await AxiosInstance.post(`/roles/approve/${role_id}`, { headers: { 'Authorization': 'Bearer ' + token } })
    
    return new_creator
}

export const removeBusinessRole = async (role_id) => {
    const token = localStorage.getItem('token')
    const removed_role_count = await AxiosInstance.delete(`/roles/user_remove/${role_id}`, { headers: { 'Authorization': 'Bearer ' + token } })

    return removed_role_count
}

const getAllBusinessRoles = async (id) => {
    const token = localStorage.getItem('token')
    const business_roles = await AxiosInstance.get(`/roles/business/${id}`, { headers: { 'Authorization': 'Bearer ' + token } })

    return business_roles
}


export const useBusinessesQuery = () => useQuery(["businesses"], getAllBusinesses, { refetchOnMount: false })
export const useBusinessQuery = (id) => useQuery(["business", id], () => getBusiness(id))
export const useBusinessRolesQuery = (id) => useQuery(['business_roles', id], () => getAllBusinessRoles(id))
// export const useCreatorRoleMutation = (id) => useMutation(upgradeCreator(id))