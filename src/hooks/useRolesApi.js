import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";
import useAuth from "./useAuth";
import useNotification from "./useNotification";


const getUserBusinessRole = async (business_id) => { return await AxiosInstance.get(`/roles/businesses/${business_id}/user-role`) }

// using getUserBusinessRole - returns a single business management or admin role for a user
// ['user_management_role, business_id, auth.user.id]
export const useManagementRole = (business_id) => {
    const { auth, setAuth } = useAuth()
    let navigate = useNavigate()
    const { dispatch } = useNotification()

    // 404 - no role found
    return useQuery(['user_management_role', business_id, auth?.user?.id], () => getUserBusinessRole(business_id), {
        onError: (error) => {
            if (error?.response?.status === 401) {
                localStorage.removeItem('jwt')
                setAuth(null)
            }

            if (error?.response?.status === 404) {
                navigate('/profile')
            }

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })
        },
        onSuccess: (data) => {
            if (data?.data?.role_type < process.env.REACT_APP_MANAGER_ACCOUNT) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'invalid business role'
                    }
                })

                navigate('/profile')
            }
        }
    })
}

// using getUserBusinessRole - returns a single business role for a user
// ['user_business_role', business_id, auth.user.id]
export const useUserBusinessRole = (business_id) => {
    const { auth, setAuth } = useAuth();

    return useQuery(['user_business_role', business_id, auth?.user?.id], () => getUserBusinessRole(business_id), {
        onError: (error) => {
            // if token is not missing but is expired then the user will be cleared out
            if (error?.response?.status === 403) {
                localStorage.removeItem('jwt')
                setAuth(null)
            }
        },
        retry: (failureCount, error) => {
            // Don't retry if the error status is 404
            if (error?.response?.status === 404 || error?.response?.status === 400) {
                return false;
            }

            // You can specify other conditions for retry here
            // For example, retry up to 3 times for other errors
            return failureCount < 3;
        }
    })
}

// business.roles - returns all roles for selected business
// ['business_roles', business_id]
const getBusinessRoles = async (business_id) => { return await AxiosInstance.get(`/roles/businesses/${business_id}`) }
export const useBusinessRolesQuery = (business_id) => {
    const { sendToLogin } = useAuth()

    return useQuery(['business_roles', business_id], () => getBusinessRoles(business_id), {
        onError: (error) => {
            if (error?.response?.status === 403) {
                sendToLogin()
            }
        }
    })
}

// rolesTab -> passed to user.roles - return all roles for selected user (active/inactive)
// ['user_roles', user_id]
const getUserRoles = async (user_id) => { return await AxiosInstance.get(`/roles/users/${user_id}`) }
export const useUserRolesQuery = (user_id) => {
    // const { sendToLogin } = useAuth();
    // const { dispatch } = useNotification();

    return useQuery(['user_roles', user_id], () => getUserRoles(user_id), {
        onSuccess: ({ data }) => {
            console.log('success')
            console.log(data)
        },
        onError: (error) => {
            console.log('error')
            console.log(error)
            // if (error?.response?.status === 403) {
            //     sendToLogin()
            // }

            // if (error?.response?.status === 400) {
            //     dispatch({
            //         type: "ADD_NOTIFICATION",
            //         payload: {
            //             notification_type: 'ERROR',
            //             message: error?.response?.data?.error?.message
            //         }
            //     })
            // }
        }
    })
}

// role.request - CREATES NEW ROLE REQUEST
// refetch -> ['business_roles', business_id], ['user_roles', user_id]
const createRoleRequest = async (business_id) => { return await AxiosInstance.post(`/roles/businesses/${business_id}/role-requests`) }
export const useCreateRoleMutation = () => {
    const { auth } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    let navigate = useNavigate();

    return useMutation(createRoleRequest, {
        onSuccess: (data) => {

            queryClient.refetchQueries(['business_roles', data?.data?.business_id])
            queryClient.refetchQueries(['user_roles', auth?.user?.id])

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: 'your request has been submitted for approval'
                }
            })
        },
        onError: (error) => {
            if (error?.response?.status === 403) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })

                navigate('/login')
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
// refetch -> ['roles'], ['business_roles', data.business_id], ['user_roles', data.user_id], ['user_business_role'], ['user_management_role']
const roleAction = async ({ role_id, action_type }) => { return await AxiosInstance.put(`/roles/${role_id}/actions`, { action_type: action_type }) }
export const useRoleAction = () => {
    const { sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation(roleAction, {
        onSuccess: ({ data }) => {

            queryClient.refetchQueries(['roles'])
            queryClient.refetchQueries(['business_roles', data?.business_id])
            queryClient.refetchQueries(['user_roles', data?.user_id])
            queryClient.refetchQueries(['user_business_role'])
            queryClient.refetchQueries(['user_management_role'])

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: 'business role has been updated'
                }
            })
        },
        onError: (error) => {
            if (error?.response?.status === 403) {
                sendToLogin()
            }

            else if (error?.response?.status === 400 || error?.response?.status === 404) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })
                
            }
            
            else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'an uncaught error has occurred'
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
    const { sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation(deleteRole, {
        onSuccess: ({ data }) => {
            // update due to roles table
            queryClient.refetchQueries(['roles']);
            queryClient.refetchQueries(['user_roles', data?.user_id]);
            queryClient.refetchQueries(['business_roles', data?.business_id]);

            // update due to events table
            queryClient.refetchQueries(['events'])
            queryClient.refetchQueries(['business_events', data?.business_id])
            queryClient.refetchQueries(['user_events', data?.user_id])

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: 'business role has been deleted'
                }
            })
        },
        onError: (error) => {
            
            if (error?.response?.status === 403) {
                sendToLogin()
            }

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