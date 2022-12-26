import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";

const getBusinessRoles = async (business_id) => { return await AxiosInstance.get(`/roles/business/${business_id}`) }
export const useBusinessRolesQuery = (business_id) => useQuery(['roles', 'business', business_id], () => getBusinessRoles(business_id))

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

// is called upgradeRole but currently only upgrades creator account to manager account
const upgradeRole = async (role_id) => { return await AxiosInstance.post(`/roles/upgrade_creator/${role_id}`) }
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

const downgradeRole = async (role_id) => { return await AxiosInstance.post(`/roles/downgrade_manager/${role_id}`) }
// downgrades 'manager' role to a 'creator' role
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