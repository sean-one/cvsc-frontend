import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";

// return an array of all events related to business id
const getBusinessEvents = async (business_id) => { return await AxiosInstance.get(`/events/business/${business_id}`) }
export const useBusinessEventsQuery = (business_id) => useQuery(["business_events", business_id], () => getBusinessEvents(business_id), { refetchOnMount: false })

// return an array of all INACTIVE user events
const getAllUserInactiveEvents = async (user_id) => { return await AxiosInstance.get(`/events/inactive_user/${user_id}`) }
export const useInactiveUserEvents = (user_id) => useQuery(["inactive", "events", "user", user_id], () => getAllUserInactiveEvents(user_id), { staleTime: 60000, refetchOnMount: false })

// return an array of all events related to user id
const getAllUserEvents = async (user_id) => { return await AxiosInstance.get(`/events/user/${user_id}`) }
export const useUserEventsQuery = (user_id) => useQuery(["events", "user", user_id], () => getAllUserEvents(user_id), { staleTime: 60000, refetchOnMount: false })

// event.view - return a single event by event id
const getEvent = async (id) => { return await AxiosInstance.get(`/events/${id}`) }
export const useEventQuery = (id) => useQuery(['events', id], () => getEvent(id), { staleTime: 60000, refetchOnMount: false })

// get an array of all upcoming events
const getAllEvents = async () => { return await AxiosInstance.get('/events') }
export const useEventsQuery = () => useQuery(["events"], getAllEvents, { refetchOnMount: false })

// event.create.form - CREATE A NEW EVENT
const createEvent = async (event) => { return await AxiosInstance.post('/events', event) }
export const useCreateEventMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(createEvent, {
        onSuccess: () => {
            queryClient.refetchQueries(['events'])
        },
        onError: (error) => {
            console.log(error)
        },
    })
}

// event.edit.form - update_event - UPDATE EVENT
const updateEvent = async ({ event_updates, event_id }) => { return await AxiosInstance.put(`/events/${event_id}`, event_updates) }
export const useUpdateEventMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(updateEvent, {
        onSuccess: ({ data }) => {
            queryClient.refetchQueries(['events', 'event', data.event_id])
        },
        onError: (error) => {
            console.log(error)
        },
    })
}

// business_label - remove_event_business
const removeBusiness = async ({ event_id, ...event_updates }) => { return await AxiosInstance.put(`/events/business/remove/${event_id}`, event_updates) }
export const useRemoveEventBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeBusiness, {
        onSuccess: ({ data }) => {
            queryClient.refetchQueries(['businesses', 'events', 'event', data.id])
        },
        onError: (error) => {
            console.log('error inside event business remove mutation')
            console.log(error)
        },
    })
}

// event.edit.form - remove_event
const removeEvent = async (event_id) => { return await AxiosInstance.delete(`/events/remove/${event_id}`) }
export const useRemoveEventMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeEvent, {
        onSuccess: () => {
            queryClient.refetchQueries(['events'])
        },
        onError: (error) => {
            console.log(error)
        },
    })
}