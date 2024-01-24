import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";
import useAuth from "./useAuth";
import useNotification from "./useNotification";
import useEventImagePreview from "./useEventImagePreview";
 

// business.label - remove_event_business
// refetch -> ['events'], ['business_events'], ['user_events']
const removeBusiness = async ({ event_id, business_id }) => { return await AxiosInstance.put(`/events/${event_id}/remove/${business_id}`) }
export const useRemoveEventBusinessMutation = () => {
    const queryClient = useQueryClient();
    const { dispatch } = useNotification();
    let navigate = useNavigate();

    return useMutation(removeBusiness, {
        onSuccess: ({ data }) => {

            queryClient.refetchQueries(['events'])
            queryClient.refetchQueries(['business_events'])
            queryClient.refetchQueries(['user_events'])

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: 'business successfully removed from event'
                }
            })

            navigate(`/business/${data?.business_id}`)
        },
        onError: (error) => {
            // 401, 403 'token', 400 'business_id', 'event_id' & 'server'
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

// return an array of all events related to business id
// ['business_events', business_id]
const getBusinessEvents = async (business_id) => { return await AxiosInstance.get(`/events/business/${business_id}`) }
export const useBusinessEventsQuery = (business_id) => {
    const { dispatch } = useNotification();
    
    return useQuery(["business_events", business_id], () => getBusinessEvents(business_id), {
        refetchOnMount: false,
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

// return an array of all events related to user id
// ['user_events', user_id]
const getAllUserEvents = async (user_id) => { return await AxiosInstance.get(`/events/user/${user_id}`) }
export const useUserEventsQuery = (user_id) => {
    const { dispatch } = useNotification()

    return useQuery(["user_events", user_id], () => getAllUserEvents(user_id), {
        staleTime: 60000,
        refetchOnMount: false,
        onError: (error) => {
            // 401, 403 - type: 'token', 400 - type: 'user_id'
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

// event.view - return a single event by event id
// event.edit.view - uses endpoint directly without query
// ['events', event_id]
const getEvent = async (event_id) => { return await AxiosInstance.get(`/events/${event_id}`) }
export const useEventQuery = (event_id) => {
    const { dispatch } = useNotification()

    return useQuery(['events', event_id], () => getEvent(event_id), {
        staleTime: 60000,
        refetchOnMount: false,
        onError: (error) => {
            // 400 - type: 'event_id', 404 - type: 'server'
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

// event.edit.form - update_event - UPDATE EVENT
// refetch -> ['events'], ['business_events'], ['user_events']
const updateEvent = async ({ event_updates, event_id }) => { return await AxiosInstance.put(`/events/${event_id}`, event_updates) }
export const useUpdateEventMutation = () => {
    const queryClient = useQueryClient();
    const { dispatch } = useNotification();
    const { auth, sendToLogin } = useAuth();
    let navigate = useNavigate();

    return useMutation(updateEvent, {
        onSuccess: ({ data }) => {
            localStorage.removeItem('editEventForm')

            queryClient.refetchQueries(['events'])
            queryClient.refetchQueries(['business_events'])
            queryClient.refetchQueries(['user_events', auth?.user?.id])

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${data?.eventname} has been successfully updated`
                }
            })

            navigate(`/event/${data?.event_id}`)
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
        },
    })
}

// event.edit.form - remove_event
// refetch -> ['events'], ['business_events'], ['user_events']
const removeEvent = async (event_id) => { return await AxiosInstance.delete(`/events/${event_id}`) }
export const useRemoveEventMutation = () => {
    const queryClient = useQueryClient();
    const { auth, sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    let navigate = useNavigate();

    return useMutation(removeEvent, {
        onSuccess: ({ data }) => {
            localStorage.removeItem('editEventForm')

            queryClient.refetchQueries(['events'])
            queryClient.refetchQueries(['business_events'])
            queryClient.refetchQueries(['user_events', auth?.user?.id])

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${data?.eventname} has successfully been deleted`
                }
            })

            navigate('/profile/events')
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
            // 400 - type: 'event_id', 'server', 404 - type: 'server'
            else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })

                navigate('/profile/events')
            }
        },
    })
}

// get an array of all upcoming events
// ['events']
const getAllEvents = async () => { return await AxiosInstance.get('/events') }
export const useEventsQuery = () => useQuery(["events"], getAllEvents, {refetchOnMount: false})

// event.create.form - CREATE A NEW EVENT
// refetch -> ['events'], ['business_events'], ['user_events']
const createEvent = async (event) => { return await AxiosInstance.post('/events', event) }
export const useCreateEventMutation = () => {
    const { auth, sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    const { setEditImage } = useEventImagePreview()
    let navigate = useNavigate();

    return useMutation(createEvent, {
        onSuccess: (data) => {
            localStorage.removeItem('createEventForm')

            queryClient.refetchQueries(['events'])
            queryClient.refetchQueries(['business_events'])
            queryClient.refetchQueries(['user_events', auth?.user?.id])

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${data.data.eventname} has been created`
                }
            })

            setEditImage(false)

            navigate(`/event/${data.data.event_id}`)
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
            // 400 - type: *path, 'role_rights', 'media_error' handled on component
        },
    })
}