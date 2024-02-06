import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";
import useAuth from "./useAuth";
import useNotification from "./useNotification";


// event.create.form, event.edit.form, role.request
// ['businesses'] --- 10m stale
//! update ready
const getBusinesses = async () => { return await AxiosInstance.get('/businesses') }
export const useBusinessesQuery = () => useQuery({ queryKey: ['businesses'], queryFn: () => getBusinesses() });

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
// ['business_management', auth.user.id] --- 5m stale
//! update ready
const getManagersBusinesses = async () => { return await AxiosInstance.get('/businesses/managed') }
export const useBusinessManagement = () => {
    const { auth } = useAuth();
    return useQuery({ queryKey: ['business_management', auth?.user?.id], queryFn: () => getManagersBusinesses() })
};

// businessView & business.admin.view 
// ['business', business_id] --- 10m stale
//! update ready
const getBusiness = async (business_id) => { return await AxiosInstance.get(`/businesses/${business_id}`) }
export const useBusinessQuery = (business_id) => useQuery({ queryKey: ['business', business_id], queryFn: () => getBusiness(business_id) });

// business.admin.menu - toggle active & toggle request
// ['business', business_id]
const toggleBusiness = async ({ business_id, toggle_type }) => { return await AxiosInstance.put(`/businesses/${business_id}/status/toggle`, toggle_type) }
export const useBusinessToggle = () => {
    const { auth, sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation(toggleBusiness, {
        onSuccess: ({ data }) => {
            // update business table touched
            queryClient.refetchQueries(['businesses'])
            queryClient.refetchQueries(['business', data?.id])
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
            } else {
                // 400 - type: 'business_id', 'server', 403, 404 - type: 'server'
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

// business.edit.form - EDIT BUSINESS
const updateBusiness = async ({ business_id, business_updates }) => { return await AxiosInstance.put(`/businesses/${business_id}`, business_updates) }
export const useUpdateBusinessMutation = () => {
    const { sendToLogin } = useAuth()
    const { dispatch } = useNotification()
    const queryClient = useQueryClient()
    let navigate = useNavigate();

    return useMutation(updateBusiness, {
        onSuccess: ({data}) => {
            // remove saved from local storage
            localStorage.removeItem('editBusinessForm')

            queryClient.refetchQueries(['businesses'])
            queryClient.refetchQueries(['events'])

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${data?.business_name} has successfully been updated`
                }
            })

            navigate(`/business/${data?.id}`)
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
            // 400 - type: *path, 'media_error', 'server', 403, 404 - type: 'server' handled on component
        },
    })
}

// business.admin.view - REMOVES BUSINESS & INVALIDATES ANY UPCOMING EVENT
const removeBusiness = async (business_id) => { return await AxiosInstance.delete(`/businesses/${business_id}`) }
export const useRemoveBusinessMutation = (onDeleteSuccess) => {
    const { sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation(removeBusiness, {
        onSuccess: ({ data }) => {
            console.log(data?.business_id)
            // events table updated
            queryClient.invalidateQueries(['events'])
            queryClient.invalidateQueries(['user_events'])
            // roles table updated
            queryClient.invalidateQueries(['roles'])
            queryClient.invalidateQueries(['user_roles'])
            // business table updated
            queryClient.invalidateQueries(['businesses'])

            // removed deleted business from queries
            queryClient.removeQueries(['business', data?.business_id])
            queryClient.removeQueries(['business_events', data?.business_id])
            queryClient.removeQueries(['business_roles', data?.business_id])
            queryClient.removeQueries(['business_management', data?.business_id])

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: 'business has been deleted successfully'
                }
            })
            onDeleteSuccess()
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
            } else {
                // 403, 404 - type: 'server'
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