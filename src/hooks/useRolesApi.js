import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import AxiosInstance from "../helpers/axios";
import { eventKeys, roleKeys } from "../helpers/queryKeyFactories";
import useAuth from "./useAuth";
import useNotification from "./useNotification";


// business.roles - returns all roles for selected business
const getBusinessRoles = async (business_id) => { return await AxiosInstance.get(`/roles/businesses/${business_id}`) }
export const useBusinessRolesQuery = (business_id) => useQuery({ queryKey: roleKeys.businessRoles(business_id), queryFn: () => getBusinessRoles(business_id) });

const getBusinessManagers = async (business_id) => { return await AxiosInstance.get(`/roles/managers/${business_id}`) }
export const useBusinessManagerQuery = (business_id) => useQuery({ queryKey: roleKeys.managerRoles(business_id), queryFn: () => getBusinessManagers(business_id) });

// rolesTab -> passed to user.roles - return all roles for selected user (active/inactive)
const getUserRoles = async (user_id) => { return await AxiosInstance.get(`/roles/users/${user_id}`) }
export const useUserRolesQuery = (user_id) => useQuery({ queryKey: roleKeys.userRoles(user_id), queryFn: () => getUserRoles(user_id) });

// user.account - returns the highest role type for a specific user
const getUserAccountRole = async (user_id) => { return await AxiosInstance.get(`/roles/users/${user_id}/account-role`) }
export const useUserAccountRole = (user_id) => useQuery({ queryKey: roleKeys.userAccountRole(user_id), queryFn: () => getUserAccountRole(user_id) });

// role.request - creates a new role request
const createRoleRequest = async (business_id) => { return await AxiosInstance.post(`/roles/businesses/${business_id}/role-requests`) }
export const useCreateRoleMutation = () => {
    const { sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (business_id) => createRoleRequest(business_id),
        onSuccess: async ({ data }) => {
            // invalidate all queries related to the user only
            await queryClient.invalidateQueries({ queryKey: roleKeys.relatedToUser() })

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `a role request for ${data?.business_name} has been sent`
                }
            })
        },
        onError: (error) => {
            // console.log(error)
            if (error?.response?.data?.error?.type === 'token') {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })

                sendToLogin()
            } else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })
            }
        },
    })
}

// aprrove.role, upgrade.role, downgrade role
const roleAction = async ({ role_id, action_type }) => { return await AxiosInstance.put(`/roles/${role_id}/actions`, { action_type: action_type }) }
export const useRoleAction = () => {
    const { sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (role_action) => roleAction(role_action),
        onSuccess: async ({ data }) => {

            await queryClient.invalidateQueries({ queryKey: roleKeys.relatedToBusiness(data?.business_id) })

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `the business role for ${data?.username} has been updated`
                }
            })
        },
        onError: (error) => {
            // 401, 403 - type: 'token'
            if (error?.response?.data?.error?.type === 'token') {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })

                sendToLogin()
            }
            // 400 - type: 'role_id' or 'server', 404 - type: 'server'
            else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })
            }

        },
    })
}

// user.role (delete)
const deleteRole = async (role_id) => { return await AxiosInstance.delete(`/roles/${role_id}`) }
export const useRoleDelete = () => {
    const { sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (role_id) => deleteRole(role_id),
        onSuccess: async () => {
            
            await queryClient.invalidateQueries({ queryKey: roleKeys.all })
            await queryClient.invalidateQueries({ queryKey: eventKeys.all })

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `role successfully deleted`
                }
            })
        },
        onError: (error) => {
            // 401, 403 - type: 'token'
            if (error?.response?.data?.error?.type === 'token') {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })

                sendToLogin()
            }
            
            // 400 - type: 'role_id' or 'server', 404 - type: 'server'
            else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })

            }

            
        }
    })
}