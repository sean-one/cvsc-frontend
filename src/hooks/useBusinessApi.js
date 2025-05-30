import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { decode } from "he";

import AxiosInstance from "../helpers/axios";
import { businessKeys, roleKeys, eventKeys } from "../helpers/queryKeyFactories";
import useAuth from "./useAuth";
import useNotification from "./useNotification";


// businesses.view, role.request
// [businessKeys.list('all_businesses')]
const getBusinesses = async () => { return await AxiosInstance.get('/businesses') }
export const useBusinessesQuery = () => useQuery({ queryKey: businessKeys.list('all_businesses'), queryFn: () => getBusinesses() });

// business.create.form - CREATE BUSINESS
// invalidateQueries - [ businessKeys.list('all_businesses'), roleKeys.relatedToUser(user_id) ]
const createBusiness = async (business) => { return await AxiosInstance.post('/businesses', business) }
export const useCreateBusinessMutation = () => {
    const { user_reset } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    let navigate = useNavigate();

    return useMutation({
        mutationFn: (business) => createBusiness(business),
        onSuccess: async ({data}) => {
            // remove saved form from local storage
            localStorage.removeItem('createBusinessForm');

            await Promise.all([
                // update business list to include newly created business
                queryClient.invalidateQueries({ queryKey: businessKeys.all }),
                // update roles for the user
                queryClient.invalidateQueries({ queryKey: roleKeys.relatedToUser(data?.business_admin) })
            ]);
            
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${decode(data?.business_name)} has been created`
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
// [businessKeys.userManagedBusinesses(user_id)]
const getManagersBusinesses = async () => { return await AxiosInstance.get('/businesses/managed') }
export const useBusinessManagement = (user_id) => useQuery({
    queryKey: businessKeys.userManagedBusinesses(user_id),
    queryFn: (user_id) => getManagersBusinesses(user_id),
    enabled: !!user_id,
});

// businessView & business.admin.view
// [businessKeys.detail(business_id)]
const getBusiness = async (business_id) => { return await AxiosInstance.get(`/businesses/${business_id}`) }
export const useBusinessQuery = (business_id) => useQuery({ queryKey: businessKeys.detail(business_id), queryFn: () => getBusiness(business_id) });

// business.toggle - toggle active & toggle request
// invalidateQueries - [businessKeys.all] && if 'active' toggle [roleKeys.relatedToBusiness(business_id)]
const toggleBusiness = async ({ business_id, toggle_type }) => { return await AxiosInstance.put(`/businesses/${business_id}/status/toggle`, toggle_type) }
export const useBusinessToggle = () => {
    const { user_reset } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    
    let navigate = useNavigate();

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
                        message: `${decode(data?.business_name)} ${data?.business_request_open ? 'is now' : 'is no longer'} accepting creator request`
                    }
                })    
            }
            
            if (data.toggleType === 'active') {
                // invalidate roles incase role table was touched ('active' toggle)
                await queryClient.invalidateQueries({ queryKey: roleKeys.relatedToBusiness(data?.id) })

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${decode(data?.business_name)} has been updated to ${data?.active_business ? 'active' : 'inactive'}`
                    }
                })

            }
        },
        onError: (error) => {
            // 401, 403 - type: 'token', 403 - type: 'server', 404 - type: 'server'
            if (error?.response?.status === 401 || error?.response?.status === 403 || error?.response?.status === 404) {
                // remove expired or bad token and reset user if they exists
                user_reset()

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })
    
                navigate('/login')
            } else {
                // 400 - type: 'business_id', 'server'
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
// invalidateQueries - [ businessKeys.all, roleKeys.relatedToUser(user_id), roleKeys.relatedToBusiness(business_id) ]
const tranferBusiness = async ({ business_id, manager_id }) => { return await AxiosInstance.put(`/businesses/${business_id}/transfer/${manager_id}`) }
export const useBusinessTransferMutation = () => {
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    let navigate = useNavigate();

    return useMutation({
        mutationFn: (transfer_details) => tranferBusiness(transfer_details),
        onSuccess: async ({data}) => {
            await Promise.all([
                // update all business keys so that 'business_admin' field is correct
                queryClient.invalidateQueries({ queryKey: businessKeys.all }),
    
                // update all the user role keys since role was adjusted, also roles related to business
                queryClient.invalidateQueries({ queryKey: roleKeys.relatedToUser(data?.admin_id) }),
                queryClient.invalidateQueries({ queryKey: roleKeys.relatedToBusiness(data?.business_id) }),
            ]);

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: 'business transfer successful'
                }
            })
            
            navigate('/profile')
        },
        onError: (error) => {
            if (error?.response?.status === 401 || error?.response?.status === 403 || error?.response?.status === 404) {
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

                navigate('/profile')
            }
        }
    })
}

// business.edit.form - EDIT BUSINESS
// invalidateQueries - [businessKeys.all]
const updateBusiness = async ({ business_id, business_updates }) => { return await AxiosInstance.put(`/businesses/${business_id}`, business_updates) }
export const useUpdateBusinessMutation = () => {
    const { user_reset } = useAuth()
    const { dispatch } = useNotification()
    const queryClient = useQueryClient()
    let navigate = useNavigate();

    return useMutation({
        mutationFn: (business_updates) => updateBusiness(business_updates),
        onSuccess: async ({data}) => {
            // remove saved from local storage
            localStorage.removeItem('editBusinessForm')
            // update so that all business list have updated business information
            await queryClient.invalidateQueries({ queryKey: businessKeys.all })

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${decode(data?.business_name)} has successfully been updated`
                }
            })

            navigate(`/business/${data?.id}`)
        },
        onError: (error) => {
            // 401, 403 - type: 'token', 403 - type: 'server'
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                // removed expired or bad token and reset user
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

// business.admin.view - REMOVES BUSINESS & INVALIDATES ANY UPCOMING EVENT
// invalidateQueries - [eventKeys.all, roleKeys.relatedToUser(user_id), businessKeys.list('all_businesses'), businessKeys.userManagedBusiness(user_id), businessKeys.detail(business_id)]
const removeBusiness = async (business_id) => { return await AxiosInstance.delete(`/businesses/${business_id}`) }
export const useRemoveBusinessMutation = (onDeleteSuccess) => {
    const { user_reset } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    let navigate = useNavigate();

    return useMutation({
        mutationFn: (business_id) => removeBusiness(business_id),
        onSuccess: async ({ data }) => {
            
            await Promise.all([
                // events table updated
                queryClient.invalidateQueries({ queryKey: eventKeys.all }),
                // roles table updated
                queryClient.invalidateQueries({ queryKey: roleKeys.relatedToUser(data?.business_admin) }),
                queryClient.invalidateQueries({ queryKey: roleKeys.userAccountRole(data?.business_admin) }),
                // business table updated
                queryClient.invalidateQueries({ queryKey: businessKeys.list('all_businesses'), exact: true }),
                queryClient.invalidateQueries({ queryKey: businessKeys.userManagedBusinesses(data?.business_admin), exact: true }),
                queryClient.invalidateQueries({ queryKey: businessKeys.detail(data?.business_id), refetchType: 'none' }),

            ]);

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${decode(data?.business_name)} has been deleted successfully`
                }
            })

            // navigate('/profile')
        },
        onError: (error) => {
            // 401, 403 - type: 'token', 404 - 'server' business not found, 403 - 'server' invalid business roles
            if (error?.response?.status === 401 || error?.response?.status === 403 || error?.response?.status === 404) {
                user_reset()

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })

                navigate('/login')

            } else {
                // 400 - type: 'server'
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