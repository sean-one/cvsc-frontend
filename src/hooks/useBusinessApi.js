import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";
import useAuth from "./useAuth";
import useNotification from "./useNotification";


// event.create.form, event.edit.form, role.request
// ['businesses']
const getBusinesses = async () => { return await AxiosInstance.get('/businesses') }
export const useBusinessesQuery = () => {
    return useQuery(['businesses'], getBusinesses, { refetchOnMount: false })
}

// business.create.form - CREATE BUSINESS
// refetch -> ['businesses'], ['business_management', auth.user.id], ['roles'], ['user_roles', auth.user.id]
const createBusiness = async (business) => { return await AxiosInstance.post('/businesses', business) }
export const useCreateBusinessMutation = () => {
    const { auth, sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation(createBusiness, {
        onSuccess: ({data}) => {
            // remove saved form from local storage
            localStorage.removeItem('createBusinessForm');
            
            queryClient.refetchQueries(['businesses'])
            queryClient.refetchQueries(['business_management', auth?.user?.id])
            
            queryClient.refetchQueries(['roles'])
            queryClient.refetchQueries(['user_roles', auth?.user?.id])


            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${data?.business_name} has been created`
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
            // 400 - type: *path, 'media_error', 'server' & 409 - type: 'business_name' handled on component
        },
    })
}

// management.list
// ['business_management', auth.user.id]
const getManagersBusinesses = async () => { return await AxiosInstance.get('/businesses/managed') }
export const useBusinessManagement = () => {
    const { auth, sendToLogin } = useAuth();
    const { dispatch } = useNotification();

    return useQuery(['business_management', auth?.user?.id], getManagersBusinesses, {
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
            } else  {
                // 400, 404 - type: 'server'
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

// businessView & business.admin.view 
// ['businesses', business_id]
const getBusiness = async (business_id) => { return await AxiosInstance.get(`/businesses/${business_id}`) }
export const useBusinessQuery = (business_id) => {
    const { dispatch } = useNotification()

    return useQuery(['businesses', business_id], () => getBusiness(business_id), {
        onError: (error) => {
            // 400 - type: 'business_id'
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

// business.admin.menu - toggle active & toggle request
// ['businesses', business_id]
const toggleBusiness = async ({ business_id, toggle_type }) => { return await AxiosInstance.put(`/businesses/${business_id}/status/toggle`, toggle_type) }
export const useBusinessToggle = () => {
    const { auth, sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation(toggleBusiness, {
        onSuccess: ({ data }) => {
            // update business table touched
            queryClient.refetchQueries(['businesses'])
            queryClient.refetchQueries(['businesses', data?.id])
            queryClient.refetchQueries(['business_management', auth?.user?.id])

            if (data.toggleType === 'request') {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${data?.business_name} ${data?.business_request_open ? 'is now' : 'is no longer'} accepting creator request`
                    }
                })    
            }

            if (data.toggleType === 'active') {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${data?.business_name} has been updated to ${data?.active_business ? 'active' : 'inactive'}`
                    }
                })

                // update roles table touched
                queryClient.refetchQueries(['roles'])
                queryClient.refetchQueries(['user_roles'])
                queryClient.refetchQueries(['business_roles', data.id])
            }
        },
        onError: (error) => {
            
            if (error?.response?.status === 401 || error?.response?.status === 403) {                                
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

            console.log(error)
        },
    })
}

// business.edit.form - EDIT BUSINESS
const updateBusiness = async ({ business_id, business_updates }) => { return await AxiosInstance.put(`/businesses/${business_id}`, business_updates) }
export const useUpdateBusinessMutation = () => {
    const { sendToLogin } = useAuth()
    const { dispatch } = useNotification()
    const queryClient = useQueryClient()

    return useMutation(updateBusiness, {
        onSuccess: () => {
            queryClient.refetchQueries(['businesses'])
            queryClient.refetchQueries(['events'])
        },
        onError: (error) => {
            if (error?.response?.status === 401) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })

                sendToLogin()
            }
        },
    })
}

//! business.admin.view - REMOVES BUSINESS & INVALIDATES ANY UPCOMING EVENT
const removeBusiness = async (business_id) => { return await AxiosInstance.delete(`/businesses/${business_id}`) }
export const useRemoveBusinessMutation = () => {
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    let navigate = useNavigate();

    return useMutation(removeBusiness, {
        onSuccess: ({ data }) => {
            // events table updated
            queryClient.refetchQueries(['events'])
            queryClient.refetchQueries(['business_events'])
            queryClient.refetchQueries(['user_events'])
            // roles table updated
            queryClient.refetchQueries(['roles'])
            queryClient.refetchQueries(['user_roles'])
            queryClient.refetchQueries(['business_roles'])
            // business table updated
            queryClient.refetchQueries(['businesses'])
            queryClient.refetchQueries(['business_management'])

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: 'business has been deleted successfully'
                }
            })

            navigate('/profile/admin')
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
            }

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })
        },
    })
}