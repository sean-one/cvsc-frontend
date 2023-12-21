import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";
import useAuth from "./useAuth";
import useNotification from "./useNotification";


// - returns a single business role for a user
// ['user_business_role, auth.user.id]
const getUserBusinessRole = async (business_id) => { return await AxiosInstance.get(`/roles/businesses/${business_id}/user-role`) }
export const useManagementRole = (business_id) => {
    const { auth, setAuth } = useAuth()
    let navigate = useNavigate()
    const { dispatch } = useNotification()

    return useQuery(['user_business_role', auth?.user?.id], () => getUserBusinessRole(business_id), {
        onError: (error) => {
            if (error?.response?.status === 401) {
                localStorage.removeItem('jwt')
                setAuth({})
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

// business.roles - returns all roles for selected business
// ['business_roles', business_id]
const getBusinessRoles = async (business_id) => { return await AxiosInstance.get(`/roles/businesses/${business_id}`) }
export const useBusinessRolesQuery = (business_id) => {
    const { setAuth } = useAuth()
    let navigate = useNavigate()

    return useQuery(['business_roles', business_id], () => getBusinessRoles(business_id), {
        onError: (error) => {
            if (error?.response?.status === 401) {
                localStorage.removeItem('jwt')
                setAuth({})
                navigate('/login')
            }
        }
    })
}

// rolesTab -> passed to user.roles - return all roles for selected user (active/inactive)
// ['user_roles']
const getUserRoles = async (user_id) => { return await AxiosInstance.get(`/roles/users/${user_id}`) }
export const useUserRolesQuery = (user_id) => {
    const { setAuth } = useAuth();
    const { dispatch } = useNotification();
    let navigate = useNavigate();

    return useQuery(['user_roles', user_id], () => getUserRoles(user_id), {
        onError: (error) => {
            if (error?.response?.status === 403) {
                localStorage.removeItem('jwt');
                setAuth({});
                navigate('/login');
            }

            if (error?.response?.status === 400) {
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
// refetch -> ['roles']
//! update this to have a business id so that i can just update business_roles instead of all roles & do the same with a user id
const roleAction = async ({ role_id, action_type }) => { return await AxiosInstance.put(`/roles/${role_id}/actions`, { action_type: action_type }) }
export const useRoleAction = () => {
    const { setAuth } = useAuth();
    const queryClient = useQueryClient();
    let navigate = useNavigate();

    return useMutation(roleAction, {
        onSuccess: ({ data }) => {
            queryClient.refetchQueries(['roles'])
        },
        onError: (error, role_error, context) => {
            if (error?.response?.status === 400 || error?.response?.status === 401) {
                localStorage.removeItem('jwt')
                setAuth({})
                navigate('/login')
            } else {
                throw error
            }
        },
    })
}

// user.role (delete)
// refetch -> ['user_roles', data.user_id], ['business_roles', data.business_id]
const deleteRole = async (role_id) => { return await AxiosInstance.delete(`/roles/${role_id}`) }
export const useRoleDelete = () => {
    const { setAuth } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    let navigate = useNavigate();

    return useMutation(deleteRole, {
        onSuccess: ({ data }) => {

            queryClient.refetchQueries(['roles']);
            queryClient.refetchQueries(['user_roles', data.user_id]);
            queryClient.refetchQueries(['business_roles', data.business_id]);

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
                localStorage.removeItem('jwt')
                setAuth({})
                navigate('/login')
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