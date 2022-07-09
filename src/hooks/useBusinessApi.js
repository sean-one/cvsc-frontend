import { useMutation, useQuery, useQueryClient } from "react-query";
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

const upgradeCreator = async (role_id) => {
    const token = localStorage.getItem('token')
    const new_manager = await AxiosInstance.post(`/roles/upgrade_creator/${role_id}`, { headers: { 'Authorization': 'Bearer ' + token } })
    
    return new_manager
}

const downgradeManager = async (role_id) => {
    const token = localStorage.getItem('token')
    const updated_role = await AxiosInstance.post(`/roles/downgrade_manager/${role_id}`, { headers: { 'Authorization': 'Bearer ' + token } })

    return updated_role
}

const approvePendingRole = async (role_id) => {
    const token = localStorage.getItem('token')
    const new_creator = await AxiosInstance.post(`/roles/approve_pending/${role_id}`, { headers: { 'Authorization': 'Bearer ' + token } })
    
    return new_creator
}

const removeUserRole = async (role_id) => {
    const token = localStorage.getItem('token')
    const removed_role_count = await AxiosInstance.delete(`/roles/user_remove/${role_id}`, { headers: { 'Authorization': 'Bearer ' + token } })

    return removed_role_count
}

const removeManagerRole = async (role_id) => {
    const token = localStorage.getItem('token')
    const removed_role_count = await AxiosInstance.delete(`/roles/manager_remove/${role_id}`, { headers: { 'Authorization': 'Bearer ' + token } })

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

// approves pending role request and adjust 'active_role: true'
export const usePendingRoleMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(approvePendingRole, {
        onSuccess: () => {
            queryClient.invalidateQueries('business_roles')
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries('business_roles'),
})}

// upgrades 'creator' role to a 'manager' role
export const useCreatorUpgradeMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(upgradeCreator, {
        onSuccess: () => {
            queryClient.invalidateQueries('business_roles')
        },
        onError: (error) => {
            console.log(Object.keys(error))
            console.log(error.response)
        },
        onSettled: () => queryClient.refetchQueries('business_roles'),
    })
}

// downgrades 'manager' role to a 'creator' role
export const useManagerDowngradeMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(downgradeManager, {
        onSuccess: () => {
            queryClient.invalidateQueries('business_roles')
        },
        onError: (error) => {
            console.log(Object.keys(error))
            console.log(error.response)
        },
        onSettled: () => queryClient.refetchQueries('business_roles'),
    })
}

// removes 'creator' and 'active_role: false' roles ONLY
export const useUserRoleDeleteMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeUserRole, {
        onSuccess: () => {
            queryClient.invalidateQueries('business_roles')
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries('business_roles'),
    })
}

export const useManagerRoleDeleteMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeManagerRole, {
        onSuccess: () => {
            queryClient.invalidateQueries('business_roles')
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries('business_roles'),
    })
}