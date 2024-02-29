import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import AxiosInstance from "../helpers/axios";
import { eventKeys } from "../helpers/queryKeyFactories";
import useAuth from "./useAuth";
import useNotification from "./useNotification";
import useEventImagePreview from "./useEventImagePreview";


// business.label - remove_event_business
// const removeBusiness = ({ event_id, business_id }) => { return AxiosInstance.put(`/events/${event_id}/remove/${business_id}`)}
// export const useRemoveEventBusinessMutation = () => {
//     const queryClient = useQueryClient();
//     const { dispatch } = useNotification();
//     let navigate = useNavigate();

//     return useMutation({
//         mutationFn: ({ event_id, business_id }) => removeBusiness({ event_id, business_id }),
//         onSuccess: async ({ data }) => {
            
//             await queryClient.invalidateQueries({ queryKey: eventKeys.all })

//             dispatch({
//                 type: "ADD_NOTIFICATION",
//                 payload: {
//                     notification_type: 'SUCCESS',
//                     message: 'business successfully removed from event'
//                 }
//             })

//             navigate(`/business/${data?.business_id}`)
//         }
//     })
// }

// return an array of all events related to business id
// const getBusinessEvents = async (business_id) => { return await AxiosInstance.get(`/events/business/${business_id}`) }
// export const useBusinessEventsQuery = (business_id) => useQuery({ queryKey: eventKeys.relatedToBusiness(business_id), queryFn: () => getBusinessEvents(business_id) })

// return an array of all events related to event id (all events including venue business or brand business)
// const getEventRelatedEvents = async (event_id) => { return await AxiosInstance.get(`/events/event-related/${event_id}`) }
// export const useEventRelatedEventsQuery = (event_id) => useQuery({ queryKey: eventKeys.relatedToEvent(event_id), queryFn: () => getEventRelatedEvents(event_id) })

// return an array of all events related to user id
const getAllUserEvents = async (user_id) => { return await AxiosInstance.get(`/events/user/${user_id}`) }
export const useUserEventsQuery = (user_id) => useQuery({ queryKey: eventKeys.relatedToUser(user_id), queryFn: () => getAllUserEvents(user_id) });

// event.view - return a single event by event id
// event.edit.view - uses endpoint directly without query
const getEvent = async (event_id) => { return await AxiosInstance.get(`/events/${event_id}`) }
export const useEventQuery = (event_id) => useQuery({ queryKey: eventKeys.detail(event_id), queryFn: () => getEvent(event_id) });

// event.edit.form - update_event - UPDATE EVENT
const updateEvent = async ({ event_updates, event_id }) => { return await AxiosInstance.put(`/events/${event_id}`, event_updates) }
export const useUpdateEventMutation = () => {
    const queryClient = useQueryClient();
    const { dispatch } = useNotification();
    const { sendToLogin } = useAuth();
    let navigate = useNavigate();

    return useMutation({
        mutationFn: (event) => updateEvent(event),
        onSuccess: async ({ data }) => {
            localStorage.removeItem('editEventForm')

            await queryClient.invalidateQueries({ queryKey: eventKeys.all })

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
const removeEvent = async (event_id) => { return await AxiosInstance.delete(`/events/${event_id}`) }
export const useRemoveEventMutation = () => {
    const queryClient = useQueryClient();
    const { sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    let navigate = useNavigate();

    return useMutation({
        mutationFn: (event_id) => removeEvent(event_id),
        onSuccess: async ({ data }) => {
            localStorage.removeItem('editEventForm')

            await queryClient.invalidateQueries({ queryKey: eventKeys.all })

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
const getAllEvents = async () => { return await AxiosInstance.get('/events') }
export const useEventsQuery = () => useQuery({ queryKey: eventKeys.all, queryFn: () => getAllEvents() })

// event.create.form - CREATE A NEW EVENT
const createEvent = async (event) => { return await AxiosInstance.post('/events', event) }
export const useCreateEventMutation = () => {
    const { user_reset } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    const { setEditImage } = useEventImagePreview()
    let navigate = useNavigate();

    return useMutation({
        mutationFn: (event) => createEvent(event),
        onSuccess: async ({data}) => {
            localStorage.removeItem('createEventForm')
            
            await queryClient.invalidateQueries({ queryKey: eventKeys.all })
            
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${data?.eventname} has been created`
                }
            })

            setEditImage(false)

            navigate(`/event/${data?.event_id}`)
        },
        onError: (error) => {
            // 401, 403 - type: 'token'
            if (error?.response?.data?.error?.type === 'token') {
                // remove expired or bad token and reset user
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
            // 400 - type: *path, 'role_rights', 'media_error' handled on component
        },
    })
}