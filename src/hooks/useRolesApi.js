import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { decode } from "he";

import AxiosInstance from "../helpers/axios";
import { eventKeys, roleKeys } from "../helpers/queryKeyFactories";
import useAuth from "./useAuth";
import useNotification from "./useNotification";
import { useNavigate } from "react-router-dom";


// business.roles - returns all roles for selected business
// [ roleKeys.businessRoles(business_id) ]
const getBusinessRoles = async (business_id) => { return await AxiosInstance.get(`/roles/businesses/${business_id}`) }
export const useBusinessRolesQuery = (business_id) => useQuery({ queryKey: roleKeys.businessRoles(business_id), queryFn: () => getBusinessRoles(business_id) });

// rolesTab -> passed to user.roles - return all roles for selected user (active/inactive)
// [ roleKeys.userRoles(user_id) ]
const getUserRoles = async (user_id) => { return await AxiosInstance.get(`/roles/users/${user_id}`) }
export const useUserRolesQuery = (user_id) => useQuery({ queryKey: roleKeys.userRoles(user_id), queryFn: () => getUserRoles(user_id) });

// user.account - returns the highest role type for a specific user
// [ roleKeys.userAccountRole(user_id) ]
const getUserAccountRole = async (user_id) => { return await AxiosInstance.get(`/roles/users/${user_id}/account-role`) }
export const useUserAccountRole = (user_id) => {
    const { isLoggedIn } = useAuth()
    
    return useQuery({
        queryKey: roleKeys.userAccountRole(user_id),
        queryFn: () => getUserAccountRole(user_id),
        enabled: !!isLoggedIn
    })
};

// role.request - creates a new role request
// invalidateQueries - [ roleKeys.relatedToUser(user_id) ]
const createRoleRequest = async (business_id) => { return await AxiosInstance.post(`/roles/businesses/${business_id}/role-requests`) }
export const useCreateRoleMutation = () => {
    const { user_reset } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    let navigate = useNavigate()

    return useMutation({
        mutationFn: (business_id) => createRoleRequest(business_id),
        onSuccess: async ({ data }) => {
            
            // invalidate all queries related to the user only
            await queryClient.invalidateQueries({ queryKey: roleKeys.relatedToUser(data?.user_id) })

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `request to ${decode(data?.business_name)} sent`
                }
            })
        },
        onError: (error) => {
            // 401, 403 token errors
            if (error?.response?.data?.error?.type === 'token') {
                // remove expired or bad token and reset user
                user_reset()

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })

                navigate('/login')
            }
            // 400 - type 'server' or invalid fields handled on component
        },
    })
}

// aprrove.role, upgrade.role, downgrade role
// invalidateQueries - [ roleKeys.relatedToBusiness(business_id) ]
const roleAction = async ({ role_id, action_type }) => { return await AxiosInstance.put(`/roles/${role_id}/actions`, { action_type: action_type }) }
export const useRoleAction = () => {
    const { user_reset } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    let navigate = useNavigate();

    return useMutation({
        mutationFn: (role_action) => roleAction(role_action),
        onSuccess: async ({ data }) => {
            
            await queryClient.invalidateQueries({ queryKey: roleKeys.relatedToBusiness(data?.business_id) })

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${decode(data?.username)} has been updated`
                }
            })
        },
        onError: (error) => {
            // 401, 403 - type: 'token'
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                // remove expired or bad token and reset user
                user_reset();

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })

                navigate('/login')
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
// invalidateQueries - [ roleKeys.relatedToBusiness(business_id), eventKeys.all, roleKeys.relatedToUser(user_id) ]
const deleteRole = async (role_id) => { return await AxiosInstance.delete(`/roles/${role_id}`) }
export const useRoleDelete = () => {
    const { user_reset } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    let navigate = useNavigate()

    return useMutation({
        mutationFn: (role_id) => deleteRole(role_id),
        onSuccess: async ({ data }) => {
            
            await queryClient.invalidateQueries({ queryKey: roleKeys.relatedToBusiness(data?.business_id) })
            await queryClient.invalidateQueries({ queryKey: eventKeys.all })

            if (data?.my_role) {
                await queryClient.invalidateQueries({ queryKey: roleKeys.relatedToUser(data?.user_id) })
            }

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
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                // remove expired or bad token and reset user
                user_reset()

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })

                navigate('/')
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