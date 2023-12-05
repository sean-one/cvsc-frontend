import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";
import useAuth from "./useAuth";


// - returns a single business role for a user
const getUserBusinessRole = async (business_id) => { return await AxiosInstance.get(`/roles/businesses/${business_id}/user-role`) }
export const useUserBusinessRole = (business_id) => {
    const { auth } = useAuth()

    return useQuery(['roles', 'user_role', auth?.user?.id], () => getUserBusinessRole(business_id))
}

// business.roles - returns all roles for selected business
const getBusinessRoles = async (business_id) => { return await AxiosInstance.get(`/roles/businesses/${business_id}`) }
export const useBusinessRolesQuery = (business_id) => {
    const { setAuth } = useAuth()
    let navigate = useNavigate()

    return useQuery(['roles', 'business', business_id], () => getBusinessRoles(business_id), {
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
const getUserRoles = async (user_id) => { return await AxiosInstance.get(`/roles/users/${user_id}`) }
export const useUserRolesQuery = (user_id) => {
    const { setAuth } = useAuth()
    let navigate = useNavigate()

    return useQuery(['roles', 'user', user_id], () => getUserRoles(user_id), {
        onError: (error) => {
            if (error?.response?.status === 401) {
                localStorage.removeItem('jwt');
                setAuth({});
                navigate('/login');
            }
        }
    })
}

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
const deleteRole = async (role_id) => { return await AxiosInstance.delete(`/roles/${role_id}`) }
export const useRoleDelete = () => {
    const queryClient = useQueryClient()
    return useMutation(deleteRole, {
        onSuccess: ({ data }) => {
            queryClient.refetchQueries(['roles', 'user', data.user_id]);
            queryClient.refetchQueries(['business', 'roles', data.business_id]);
        },
        onError: (error) => {
            console.log(error)
        }
    })
}