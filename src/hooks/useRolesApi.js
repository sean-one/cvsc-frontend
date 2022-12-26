import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";

// get all the role associated with a selected business
const getBusinessRoles = async (business_id) => { return await AxiosInstance.get(`/roles/business/${business_id}`) }
export const useBusinessRolesQuery = (business_id) => useQuery(['roles', 'business', business_id], () => getBusinessRoles(business_id))

// creates new role request
const createRoleRequest = async (business_id) => { return await AxiosInstance.post(`/roles/request/${business_id}`) }
export const useCreateRoleMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(createRoleRequest, {
        onSuccess: () => {
            queryClient.invalidateQueries(['roles', 'business'])
            queryClient.refetchQueries(['roles'])
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => {
            queryClient.refetchQueries(['roles', 'business'])
        },
    })
}

// approves pending role request and adjust 'active_role: true'
const approveRole = async (role_id) => { return await AxiosInstance.post(`/roles/approve/${role_id}`) }
export const useApproveRoleMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(approveRole, {
        onSuccess: () => {
            queryClient.invalidateQueries(['roles', 'business'])
            queryClient.refetchQueries(['roles'])
        },
        onError: (error) => {
            console.log(Object.keys(error))
            console.log(error.response)
        },
        onSettled: () => {
            queryClient.refetchQueries(['roles', 'business'])
        },
    })
}

// is called upgradeRole but currently only upgrades creator account to manager account
const upgradeRole = async (role_id) => { return await AxiosInstance.post(`/roles/upgrade/${role_id}`) }
export const useUpgradeRoleMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(upgradeRole, {
        onSuccess: () => {
            queryClient.invalidateQueries(['roles', 'business'])
            queryClient.refetchQueries(['roles'])
        },
        onError: (error) => {
            console.log(Object.keys(error))
            console.log(error.response)
        },
        onSettled: () => queryClient.refetchQueries(['roles', 'business']),
    })
}

// called in downgradeRole but currently only downgrads manager to creator account
const downgradeRole = async (role_id) => { return await AxiosInstance.post(`/roles/downgrade/${role_id}`) }
export const useDowngradeRoleMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(downgradeRole, {
        onSuccess: () => {
            queryClient.invalidateQueries(['roles', 'business'])
            queryClient.refetchQueries(['roles'])
        },
        onError: (error) => {
            console.log(Object.keys(error))
            console.log(error.response)
        },
        onSettled: () => queryClient.refetchQueries(['roles', 'business']),
    })
}

// removes role 
const removeRole = async (role_id) => { return await AxiosInstance.delete(`/roles/remove/${role_id}`) }
export const useRemoveRoleMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeRole, {
        onSuccess: () => {
            queryClient.invalidateQueries(['roles', 'business'])
            queryClient.refetchQueries(['roles'])
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => {
            queryClient.refetchQueries(['roles', 'business'])
        },
    })
}