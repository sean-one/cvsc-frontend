import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import AxiosInstance from "../helpers/axios";
import { businessKeys, roleKeys, eventKeys } from "../helpers/queryKeyFactories";
import useAuth from "./useAuth";
import useNotification from "./useNotification";


// event.create.form, event.edit.form, role.request
const getBusinesses = async () => { return await AxiosInstance.get('/businesses') }
export const useBusinessesQuery = () => useQuery({ queryKey: businessKeys.all, queryFn: () => getBusinesses() });

// business.create.form - CREATE BUSINESS
const createBusiness = async (business) => { return await AxiosInstance.post('/businesses', business) }
export const useCreateBusinessMutation = () => {
    const { user_reset } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    let navigate = useNavigate();

    return useMutation({
        mutationFn: (business) => createBusiness(business),
        onSuccess: ({data}) => {
            // remove saved form from local storage
            localStorage.removeItem('createBusinessForm');
            
            // update business list to include newly created business
            queryClient.invalidateQueries({ queryKey: businessKeys.all })
            // update roles for the user
            queryClient.invalidateQueries({ queryKey: roleKeys.relatedToUser(data?.business_admin) })


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
            if (error?.response?.status === 401 || error?.response?.data?.error?.type === 'token') {
                // remove expired or bad token and reset auth
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
            // remaining errors handled on component
        },
    })
}

// management.list
const getManagersBusinesses = async () => { return await AxiosInstance.get('/businesses/managed') }
export const useBusinessManagement = (user_id) => useQuery({
    queryKey: businessKeys.userManagedBusinesses(user_id),
    queryFn: (user_id) => getManagersBusinesses(user_id),
    enabled: !!user_id,
});

// businessView & business.admin.view 
const getBusiness = async (business_id) => { return await AxiosInstance.get(`/businesses/${business_id}`) }
export const useBusinessQuery = (business_id) => useQuery({ queryKey: businessKeys.detail(business_id), queryFn: () => getBusiness(business_id) });

// business.admin.menu - toggle active & toggle request
// ['business', business_id]
const toggleBusiness = async ({ business_id, toggle_type }) => { return await AxiosInstance.put(`/businesses/${business_id}/status/toggle`, toggle_type) }
export const useBusinessToggle = () => {
    const { sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (toggleEvent) => toggleBusiness(toggleEvent),
        onSuccess: async ({data}) => {
            // update business table touched
            await queryClient.invalidateQueries({ queryKey: businessKeys.all })
            
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
                // invalidate roles incase role table was touched ('active' toggle)
                await queryClient.invalidateQueries({ queryKey: roleKeys.all })

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${data?.business_name} has been updated to ${data?.active_business ? 'active' : 'inactive'}`
                    }
                })

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

// business transfer
const tranferBusiness = async ({ business_id, manager_id }) => { return await AxiosInstance.put(`/businesses/${business_id}/transfer/${manager_id}`) }
export const useBusinessTransferMutation = () => {
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    let navigate = useNavigate();

    return useMutation({
        mutationFn: (transfer_details) => tranferBusiness(transfer_details),
        onSuccess: async ({data}) => {
            await queryClient.invalidateQueries({ queryKey: businessKeys.detail(data?.business_id) })

            await queryClient.invalidateQueries({ queryKey: roleKeys.relatedToUser(data?.admin_id) })
            await queryClient.invalidateQueries({ queryKey: roleKeys.relatedToBusiness(data?.business_id) })
            
            navigate('/profile')
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

// business.edit.form - EDIT BUSINESS
const updateBusiness = async ({ business_id, business_updates }) => { return await AxiosInstance.put(`/businesses/${business_id}`, business_updates) }
export const useUpdateBusinessMutation = () => {
    const { sendToLogin } = useAuth()
    const { dispatch } = useNotification()
    const queryClient = useQueryClient()
    let navigate = useNavigate();

    return useMutation({
        mutationFn: (business_updates) => updateBusiness(business_updates),
        onSuccess: async ({data}) => {
            // remove saved from local storage
            localStorage.removeItem('editBusinessForm')

            await queryClient.invalidateQueries({ queryKey: businessKeys.all })
            await queryClient.invalidateQueries({ queryKey: eventKeys.all })
            await queryClient.invalidateQueries({ queryKey: roleKeys.all })

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
    let navigate = useNavigate();

    return useMutation({
        mutationFn: (business_id) => removeBusiness(business_id),
        onSuccess: async ({ data }) => {
            // events table updated
            await queryClient.invalidateQueries({ queryKey: eventKeys.all })
            // roles table updated
            await queryClient.invalidateQueries({ queryKey: roleKeys.all })
            // business table updated
            await queryClient.invalidateQueries({ queryKey: businessKeys.all })

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${data?.business_name} has been deleted successfully`
                }
            })

            navigate('/profile')
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