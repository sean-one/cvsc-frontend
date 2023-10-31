import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";
import useAuth from "./useAuth";
import useNotification from "./useNotification";

// businessView & business.admin.view 
const getBusiness = async (id) => { return await AxiosInstance.get(`/businesses/${id}`) }
export const useBusinessQuery = (id) => {
    const { dispatch } = useNotification()
    let navigate = useNavigate()

    return useQuery(['businesses', 'business' , id], () => getBusiness(id), {
        onError: (error) => {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })

            navigate('/');
        }
    })
}

// business.label, event.create.form, event.edit.form, role.request, management.list
const getBusinesses = async () => { return await AxiosInstance.get('/businesses') }
export const useBusinessesQuery = () => {
    const { setAuth } = useAuth();
    let navigate = useNavigate();

    return useQuery(['businesses'], getBusinesses,{ refetchOnMount: false }, {
        onError: (error) => {
            if (error?.response?.status === 401) {
                localStorage.removeItem('jwt');
                setAuth({});
                navigate('/login')
            }
        }
    })
}

// business.create.form - CREATE BUSINESS
const createBusiness = async (business) => { return await AxiosInstance.post('/businesses', business) }
export const useCreateBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(createBusiness, {
        onSuccess: () => {
            queryClient.refetchQueries(['businesses', 'roles'])
        },
        onError: (error, new_business, context) => {
            console.log(error)
        },
    })
}

// business.admin.menu - toggle active & toggle request
const toggleBusiness = async ({ business_id, toggle_type }) => { return await AxiosInstance.put(`/businesses/${business_id}/toggle`, toggle_type) }
export const useBusinessToggle = () => {
    const queryClient = useQueryClient()
    return useMutation(toggleBusiness, {
        onSuccess: ({ data }) => {
            queryClient.refetchQueries(['businesses', 'business', data.id])
        },
        onError: (error, business_error, context) => { console.log(error) },
    })
}

// business.edit.form - EDIT BUSINESS
const updateBusiness = async ({ business_id, business_updates }) => { return await AxiosInstance.put(`/businesses/${business_id}`, business_updates) }
export const useUpdateBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(updateBusiness, {
        onSuccess: () => {
            queryClient.refetchQueries(['businesses', 'business', 'events'])
        },
        onError: (error, updated_business, context) => { console.log(error) },
    })
}

//! business.admin.view - REMOVES BUSINESS & INVALIDATES ANY UPCOMING EVENT
const removeBusiness = async (business_id) => { return await AxiosInstance.delete(`/businesses/${business_id}`) }
export const useRemoveBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeBusiness, {
        onSuccess: ({ data }) => {
            queryClient.refetchQueries(['businesses', 'business', 'roles', 'events', data.business_id])
        },
        onError: (error) => {
            console.log(error)
        },
    })
}