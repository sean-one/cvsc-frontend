import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";

// business.roles - returns all roles for selected business
const getBusinessRoles = async (business_id) => { return await AxiosInstance.get(`/roles/business/${business_id}`) }
export const useBusinessRolesQuery = (business_id) => useQuery(['roles', 'business', business_id], () => getBusinessRoles(business_id))

//! management.roles - returns pending roles for all businesses with management rights - GET MANAGEMENT ROLE REQUEST
const getBusinessPendingRoles = async (user_id) => { return await AxiosInstance.get(`/roles/management/${user_id}`) }
export const usePendingBusinessRolesQuery = (user_id) => useQuery(['roles', user_id], () => getBusinessPendingRoles(user_id))

//! role.request - CREATES NEW ROLE REQUEST
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

//! approve.role - APPROVE ROLE REQUEST
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

//! upgrade.role - UPGRADES CREATOR TO MANAGER
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

//! downgrade.role - DOWNGRADES MANAGER TO CREATOR
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

//! remove.role - REMOVE ROLE REQUEST (MANAGEMENT) 
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

// user.roles
const getUserRoles = async (user_id) => { return await AxiosInstance.get(`/roles/user/${user_id}`) }
export const useUserRolesQuery = (user_id) => useQuery(['roles', 'user', user_id], () => getUserRoles(user_id))


const getUserBusinessRole = async(business_id) => { return await AxiosInstance.get(`/roles/user_role/${business_id}`) }
export const useUserBusinessRoleQuery = (business_id) => useQuery(['roles', 'user', business_id], () => getUserBusinessRole(business_id), { retry: false })

//! remove.user.role - REMOVE USER ROLE (SELF)
const removeUserRole = async (role_id) => { return await AxiosInstance.delete(`/roles/user_remove/${role_id}`) }
export const useRemoveUserRoleMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeUserRole, {
        onSuccess: () => {
            queryClient.invalidateQueries(['roles', 'user'])
            queryClient.refetchQueries('roles')
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => {
            queryClient.refetchQueries(['roles', 'user'])
        },
    })
}