import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";
import useAuth from "./useAuth";
import useNotification from "./useNotification";


// event.create.form, event.edit.form, role.request
const getBusinesses = async () => { return await AxiosInstance.get('/businesses') }
export const useBusinessesQuery = () => {
    const { setAuth } = useAuth();
    let navigate = useNavigate();

    return useQuery(['businesses'], getBusinesses, {
        refetchOnMount: false,
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
            queryClient.refetchQueries(['businesses'])
            queryClient.refetchQueries(['roles'])
        },
        onError: (error, new_business, context) => {
            console.log(error)
        },
    })
}

// management.list
const getManagersBusinesses = async () => { return await AxiosInstance.get('/businesses/managed') }
export const useBusinessManagement = () => {
    const { setAuth } = useAuth();
    const { dispatch } = useNotification();
    let navigate = useNavigate();

    return useQuery(['business', 'management'], getManagersBusinesses, {
        onError: (error) => {
            console.log(error)
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })

            if (error?.response?.status === 401) {
                localStorage.removeItem('jwt');
                setAuth({});
                navigate('/login')
            }
        }
    })
}

// businessView & business.admin.view 
const getBusiness = async (business_id) => { return await AxiosInstance.get(`/businesses/${business_id}`) }
export const useBusinessQuery = (business_id) => {
    const { dispatch } = useNotification()
    let navigate = useNavigate()

    return useQuery(['businesses', 'business', business_id], () => getBusiness(business_id), {
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

// business.admin.menu - toggle active & toggle request
const toggleBusiness = async ({ business_id, toggle_type }) => { return await AxiosInstance.put(`/businesses/${business_id}/status/toggle`, toggle_type) }
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
    const { setAuth } = useAuth()
    const { dispatch } = useNotification()
    const queryClient = useQueryClient()

    return useMutation(updateBusiness, {
        onSuccess: () => {
            queryClient.refetchQueries(['businesses', 'business', 'events'])
        },
        onError: (error) => {
            if (error?.response?.status === 401) {
                localStorage.removeItem('jwt')
                setAuth({})

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })

                navigate('/login')
            }
        },
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