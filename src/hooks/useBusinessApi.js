import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";
import useAuth from "./useAuth";
import useNotification from "./useNotification";


// event.create.form, event.edit.form, role.request
// ['businesses']
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
// refetch -> ['businesses'], ['business_management', auth.user.id], ['roles'], ['user_roles', auth.user.id]
const createBusiness = async (business) => { return await AxiosInstance.post('/businesses', business) }
export const useCreateBusinessMutation = () => {
    const { auth, setAuth } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    let navigate = useNavigate();

    return useMutation(createBusiness, {
        onSuccess: (data) => {
            
            queryClient.refetchQueries(['businesses'])
            queryClient.refetchQueries(['business_management', auth?.user?.id])
            
            queryClient.refetchQueries(['roles'])
            queryClient.refetchQueries(['user_roles', auth?.user?.id])

            // remove saved form from local storage
            localStorage.removeItem('createBusinessForm');

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${data?.data?.business_name} has been created`
                }
            })
        },
        onError: (error) => {
            if (error?.response?.status === 403) {
                localStorage.removeItem('jwt');
                setAuth({})
                navigate('/login')
            }

            if (error?.response?.status === 400 || error?.response?.status === 404) {
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

// management.list
// ['business_management', auth.user.id]
const getManagersBusinesses = async () => { return await AxiosInstance.get('/businesses/managed') }
export const useBusinessManagement = () => {
    const { auth, setAuth } = useAuth();
    const { dispatch } = useNotification();
    let navigate = useNavigate();

    return useQuery(['business_management', auth?.user?.id], getManagersBusinesses, {
        onError: (error) => {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })

            if (error?.response?.status === 403 || error?.response?.status === 401) {
                localStorage.removeItem('jwt');
                setAuth({});
                navigate('/login')
            }
        }
    })
}

// businessView & business.admin.view 
// ['businesses', business_id]
const getBusiness = async (business_id) => { return await AxiosInstance.get(`/businesses/${business_id}`) }
export const useBusinessQuery = (business_id) => {
    const { dispatch } = useNotification()
    let navigate = useNavigate()

    return useQuery(['businesses', business_id], () => getBusiness(business_id), {
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
// ['businesses', business_id]
const toggleBusiness = async ({ business_id, toggle_type }) => { return await AxiosInstance.put(`/businesses/${business_id}/status/toggle`, toggle_type) }
export const useBusinessToggle = () => {
    const { auth, setAuth } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    let navigate = useNavigate();

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
                queryClient.refetchQueries(['user_business_role'])
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

                localStorage.removeItem('jwt');
                setAuth({})
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

            console.log(error)
        },
    })
}

// business.edit.form - EDIT BUSINESS
const updateBusiness = async ({ business_id, business_updates }) => { return await AxiosInstance.put(`/businesses/${business_id}`, business_updates) }
export const useUpdateBusinessMutation = () => {
    const { setAuth } = useAuth()
    const { dispatch } = useNotification()
    const queryClient = useQueryClient()
    let navigate = useNavigate()

    return useMutation(updateBusiness, {
        onSuccess: () => {
            queryClient.refetchQueries(['businesses'])
            queryClient.refetchQueries(['events'])
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