import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";

// business.roles - returns all roles for selected business
const getBusinessRoles = async (business_id) => { return await AxiosInstance.get(`/roles/businesses/${business_id}`) }
export const useBusinessRolesQuery = (business_id) => useQuery(['roles', 'business', business_id], () => getBusinessRoles(business_id))

// rolesTab -> passed to user.roles - return all roles for selected user (active/inactive)
const getUserRoles = async (user_id) => { return await AxiosInstance.get(`/roles/users/${user_id}`) }
export const useUserRolesQuery = (user_id) => useQuery(['roles', 'user', user_id], () => getUserRoles(user_id))

// role.request - CREATES NEW ROLE REQUEST
const createRoleRequest = async (business_id) => { return await AxiosInstance.post(`/roles/businesses/${business_id}/role-requests`) }
export const useCreateRoleMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(createRoleRequest, {
        onSuccess: () => {
            queryClient.refetchQueries(['roles', 'business'])
        },
        onError: (error) => {
            console.log(error)
        },
    })
}

// aprrove.role, upgrade.role, downgrade role
const roleAction = async ({ role_id, action_type }) => { return await AxiosInstance.put(`/roles/${role_id}/actions`, { action_type: action_type }) }
export const useRoleAction = () => {
    const queryClient = useQueryClient()
    return useMutation(roleAction, {
        onSuccess: ({ data }) => {
            console.log('data from onSuccess inside useRoleAction')
            console.log(data)
            queryClient.refetchQueries(['roles', 'business'])
        },
        onError: (error, role_error, context) => { console.log(error) },
    })
}

//! remove.role - REMOVE ROLE REQUEST (MANAGEMENT) 
const removeRole = async (role_id) => { return await AxiosInstance.delete(`/roles/remove/${role_id}`) }
export const useRemoveRoleMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeRole, {
        onSuccess: () => {
            queryClient.refetchQueries(['roles', 'business'])
        },
        onError: (error) => {
            console.log(error)
        },
    })
}

//! remove.user.role - REMOVE USER ROLE (SELF)
const removeUserRole = async (role_id) => { return await AxiosInstance.delete(`/roles/user_remove/${role_id}`) }
export const useRemoveUserRoleMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeUserRole, {
        onSuccess: () => {
            queryClient.refetchQueries(['roles', 'user'])
        },
        onError: (error) => {
            console.log(error)
        },
    })
}