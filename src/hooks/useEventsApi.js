import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";
import useAuth from "./useAuth";
import useNotification from "./useNotification";
import useEventImagePreview from "./useEventImagePreview";
 

// business.label - remove_event_business
// refetch -> ['events'], ['business_events'], ['user_events']
const removeBusiness = ({ event_id, business_id }) => { return AxiosInstance.put(`/events/${event_id}/remove/${business_id}`)}
export const useRemoveEventBusinessMutation = () => {
    const queryClient = useQueryClient();
    const { dispatch } = useNotification();
    let navigate = useNavigate();

    return useMutation({
        mutationFn: ({ event_id, business_id }) => removeBusiness({ event_id, business_id }),
        onSuccess: async ({ data }) => {
            console.log('data', data)
            await Promise.all([
                queryClient.refetchQueries({ queryKey: ['events'], exact: true }),
                queryClient.refetchQueries({ queryKey: ['business_events', data?.business_id], exact: true })
            ])
            queryClient.removeQueries({ queryKey: ['events', data?.event_id], exact: true })
            queryClient.removeQueries({ queryKey: ['event_related_events', data?.event_id], exact: true })
            // await queryClient.invalidateQueries(['user_events'])

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
            console.log('THE API ERROR HERE!')
            console.log(Object.keys(error))
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
// ['business_events', business_id] --- 5m stale
//! update ready
const getBusinessEvents = async (business_id) => { return await AxiosInstance.get(`/events/business/${business_id}`) }
export const useBusinessEventsQuery = (business_id) => useQuery({ queryKey: ["business_events", business_id], queryFn: () => getBusinessEvents(business_id) })

// return an array of all events related to event id (all events including venue business or brand business)
// ['event_related_events', event_id] --- 5m stale
//! update ready
const getEventRelatedEvents = async (event_id) => { return await AxiosInstance.get(`/events/event-related/${event_id}`) }
export const useEventRelatedEventsQuery = (event_id) => useQuery({ queryKey: ['event_related_events', event_id], queryFn: () => getEventRelatedEvents(event_id) })

// return an array of all events related to user id
// ['user_events', user_id] --- 5m stale
//! update ready
const getAllUserEvents = async (user_id) => { return await AxiosInstance.get(`/events/user/${user_id}`) }
export const useUserEventsQuery = (user_id) => useQuery({ queryKey: ["user_events", user_id], queryFn: () => getAllUserEvents(user_id) });

// event.view - return a single event by event id
// event.edit.view - uses endpoint directly without query
// ['events', event_id] --- 10m stale
//! update ready
const getEvent = async (event_id) => { return await AxiosInstance.get(`/events/${event_id}`) }
export const useEventQuery = (event_id) => useQuery({ queryKey: ['events', event_id], queryFn: () => getEvent(event_id) });

// event.edit.form - update_event - UPDATE EVENT
// refetch -> ['events'], ['business_events'], ['user_events']
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

            await queryClient.invalidateQueries({ queryKey: ['events', data?.event_id] })
            await queryClient.invalidateQueries({ queryKey: ['event_related_events', data?.event_id] })

            await queryClient.invalidateQueries({ queryKey: ['events'], refetchType: 'none'})
            await queryClient.invalidateQueries({ queryKey: ['business_events', data?.venue_id], refetchType: 'none' })
            await queryClient.invalidateQueries({ queryKey: ['business_events', data?.brand_id], refetchType: 'none' })
            await queryClient.invalidateQueries({ queryKey: ['user_events', data?.created_by] , refetchType: 'none' })

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
    const { sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    let navigate = useNavigate();

    return useMutation({
        mutationFn: (event_id) => removeEvent(event_id),
        onSuccess: async ({ data }) => {
            localStorage.removeItem('editEventForm')

            await queryClient.invalidateQueries({ queryKey: ['user_events', data?.created_by] })
            await queryClient.invalidateQueries({ queryKey: ['events'], refetchType: 'none' })
            await queryClient.invalidateQueries({ queryKey: ['events', data?.deleted_event_id], refetchType: 'none' })
            await queryClient.invalidateQueries({ queryKey: ['business_events', data?.venue_id], refetchType: 'none' })
            await queryClient.invalidateQueries({ queryKey: ['business_events', data?.brand_id], refetchType: 'none' })

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
// ['events'] --- 5m stale
//! update ready
const getAllEvents = async () => { return await AxiosInstance.get('/events') }
export const useEventsQuery = () => useQuery({ queryKey: ["events"], queryFn: () => getAllEvents() })

// event.create.form - CREATE A NEW EVENT
// refetch -> ['events'], ['business_events', venue_id], ['business_events', brand_id], ['user_events', user_id]
//! update ready
const createEvent = async (event) => { return await AxiosInstance.post('/events', event) }
export const useCreateEventMutation = () => {
    const { sendToLogin } = useAuth();
    const { dispatch } = useNotification();
    const queryClient = useQueryClient();
    const { setEditImage } = useEventImagePreview()
    let navigate = useNavigate();

    return useMutation({
        mutationFn: (event) => createEvent(event),
        onSuccess: async ({data}) => {
            localStorage.removeItem('createEventForm')

            await queryClient.invalidateQueries({ queryKey: ['events'] })
            await queryClient.invalidateQueries({ queryKey: ['business_events', data?.venue_id], refetchType: 'none' })
            await queryClient.invalidateQueries({ queryKey: ['business_events', data?.brand_id], refetchType: 'none' })
            await queryClient.invalidateQueries({ queryKey: ['user_events', data?.created_by], refetchType: 'none' })

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