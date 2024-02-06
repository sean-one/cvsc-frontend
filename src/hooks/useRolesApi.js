import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";
import useAuth from "./useAuth";
import useNotification from "./useNotification";


// business.roles - returns all roles for selected business
// ['business_roles', business_id] --- 5m stale
//! update ready
const getBusinessRoles = async (business_id) => { return await AxiosInstance.get(`/roles/businesses/${business_id}`) }
export const useBusinessRolesQuery = (business_id) => useQuery({
    queryKey: ['business_roles', business_id],
    queryFn: () => getBusinessRoles(business_id),
    // refetchOnWindowFocus: false,
    // staleTime: 5 * 60 * 1000
});

// rolesTab -> passed to user.roles - return all roles for selected user (active/inactive)
// ['user_roles', user_id] --- 5m stale
//! update ready
const getUserRoles = async (user_id) => { return await AxiosInstance.get(`/roles/users/${user_id}`) }
export const useUserRolesQuery = (user_id) => useQuery({
    queryKey: ['user_roles', user_id],
    queryFn: () => getUserRoles(user_id),
    // refetchOnWindowFocus: false,
    // staleTime: 5 * 60 * 1000
});

// user.account - returns the highest role type for a specific user
// ['user_account_role', user_id] --- 5m stale
//! update ready
const getUserAccountRole = async (user_id) => { return await AxiosInstance.get(`/roles/users/${user_id}/account-role`) }
export const useUserAccountRole = (user_id) => useQuery({
    queryKey: ['user_account_role', user_id],
    queryFn: () => getUserAccountRole(user_id),
    // refetchOnWindowFocus: false,
    // staleTime: 5 * 60 * 1000
});

// role.request - creates a new role request
// refetch -> ['business_roles', business_id], ['user_roles', user_id]
//! update ready
const createRoleRequest = async (business_id) => { return await AxiosInstance.post(`/roles/businesses/${business_id}/role-requests`) }
export const useCreateRoleMutation = () => {
    const { sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (business_id) => createRoleRequest(business_id),
        onSuccess: ({ data }) => {
            
            queryClient.invalidateQueries(['business_roles', data?.business_id])
            queryClient.invalidateQueries(['user_roles', data?.user_id])

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `a role request for ${data.business_name} has been sent`
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
// refetch -> ['roles'], ['business_roles', data.business_id], ['user_roles', data.user_id]
const roleAction = async ({ role_id, action_type }) => { return await AxiosInstance.put(`/roles/${role_id}/actions`, { action_type: action_type }) }
export const useRoleAction = () => {
    const { sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation(roleAction, {
        onSuccess: ({ data }) => {

            queryClient.refetchQueries(['roles'])
            queryClient.refetchQueries(['business_roles'])
            queryClient.refetchQueries(['user_roles'])

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
// refetch -> ['user_roles', data.user_id], ['business_roles', data.business_id]
//! update ready
const deleteRole = async (role_id) => { return await AxiosInstance.delete(`/roles/${role_id}`) }
export const useRoleDelete = () => {
    const { auth, sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (role_id) => deleteRole(role_id),
        onSuccess: async ({ data }) => {
            // incase deleting your own business role
            if (data?.user_id === auth?.user?.id) {
                await queryClient.invalidateQueries(['user_roles', data?.user_id])
                // incase event is marked active from role removal - remove from user_events
                await queryClient.invalidateQueries({
                    queryKey: ['user_events', data?.user_id],
                    refetchType: 'none'
                })
            }
            // removed user from business_roles
            await queryClient.invalidateQueries({
                queryKey: ['business_roles', data?.business_id],
                refetchType: 'none'
            });

            // if any events were created with removed business id, event is marked as inactive
            // removed any possible events list and business event list with newly inactive event
            await queryClient.invalidateQueries({
                queryKey: ['events'],
                refetchType: 'none'
            })
            await queryClient.invalidateQueries({
                queryKey: ['business_events', data?.business_id],
                refetchType: 'none'
            })

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${data?.business_name} role has been deleted`
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