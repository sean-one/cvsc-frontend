import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";
import useAuth from "./useAuth";
import useNotification from "./useNotification";


// business.roles - returns all roles for selected business
// ['business_roles', business_id]
const getBusinessRoles = async (business_id) => { return await AxiosInstance.get(`/roles/businesses/${business_id}`) }
export const useBusinessRolesQuery = (business_id) => {
    return useQuery(['business_roles', business_id], () => getBusinessRoles(business_id)
    // const { sendToLogin } = useAuth()
    // const { dispatch } = useNotification();

    // return useQuery(['business_roles', business_id], () => getBusinessRoles(business_id), {
    //     onError: (error) => {
    //         // 401, 403 - type: 'token'
    //         if (error?.response?.data?.error?.type === 'token') {
    //             dispatch({
    //                 type: "ADD_NOTIFICATION",
    //                 payload: {
    //                     notification_type: 'ERROR',
    //                     message: error?.response?.data?.error?.message
    //                 }
    //             })

    //             sendToLogin()
    //         } else {
    //             // 400 - type: 'business_id', 400, 404 - type: 'server'
    //             dispatch({
    //                 type: "ADD_NOTIFICATION",
    //                 payload: {
    //                     notification_type: 'ERROR',
    //                     message: error?.response?.data?.error?.message
    //                 }
    //             })
    //         }
    //     }
    // })
)}

// rolesTab -> passed to user.roles - return all roles for selected user (active/inactive)
// ['user_roles', user_id]
const getUserRoles = async (user_id) => { return await AxiosInstance.get(`/roles/users/${user_id}`) }
export const useUserRolesQuery = (user_id) => {
    const { dispatch } = useNotification();

    return useQuery(['user_roles', user_id], () => getUserRoles(user_id), {
        // staleTime: Infinity,
        // refetchOnWindowFocus: false,
        onError: (error) => {
            
            dispatch({
                type: "ADD_NOTIFICATION",
                payload : {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })
        }
    })
}

// user.account - returns the highest role type for a specific user
// ['user_account_role', user_id]
const getUserAccountRole = async (user_id) => { return await AxiosInstance.get(`/roles/users/${user_id}/account-role`) }
export const useUserAccountRole = (user_id) => {
    const { dispatch } = useNotification()

    return useQuery(['user_account_role', user_id], () => getUserAccountRole(user_id), {
        onSuccess: ({data}) => {
            console.log('success!')
            console.log(data)
        },
        onError: (error) => {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })
        }
    })
}

// role.request - creates a new role request
// refetch -> ['business_roles', business_id], ['user_roles', user_id]
const createRoleRequest = async (business_id) => { return await AxiosInstance.post(`/roles/businesses/${business_id}/role-requests`) }
export const useCreateRoleMutation = () => {
    const { auth, sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation(createRoleRequest, {
        onSuccess: ({data}) => {

            queryClient.refetchQueries(['business_roles', data?.business_id])
            queryClient.refetchQueries(['user_roles', auth?.user?.id])

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `a role request for ${data.business_name} has been sent`
                }
            })
        },
        onError: (error) => {
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
const deleteRole = async (role_id) => { return await AxiosInstance.delete(`/roles/${role_id}`) }
export const useRoleDelete = () => {
    const { auth, sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation(deleteRole, {
        onSuccess: ({ data }) => {
            // incase deleting your own business role
            queryClient.refetchQueries(['user_roles', auth?.user?.id])
            // update due to roles table
            queryClient.refetchQueries(['roles']);
            queryClient.refetchQueries(['user_roles']);
            queryClient.refetchQueries(['business_roles', data?.business_id]);

            // update due to events table
            queryClient.refetchQueries(['events'])
            queryClient.refetchQueries(['business_events', data?.business_id])
            queryClient.refetchQueries(['user_events'])

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: 'business role has been deleted'
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