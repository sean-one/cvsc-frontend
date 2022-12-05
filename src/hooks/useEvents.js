import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";


const getEvent = async (id) => {
    const single_event = await AxiosInstance.get(`/events/${id}`)

    return single_event
}

const getAllUserEvents = async (user_id) => {
    const user_event_list = await AxiosInstance.get(`/events/user/${user_id}`)

    return user_event_list;
}

const getAllBusinessEvents = async (business_id) => {
    const business_event_list = await AxiosInstance.get(`/events/business/${business_id}`)

    return business_event_list;
}

const removeEvent = async (event_id) => {
    const token = localStorage.getItem('token')
    const removed_event_count = await AxiosInstance.delete(`/events/remove/${event_id}`, { headers: { 'Authorization': 'Bearer ' + token } })

    return removed_event_count
}

const removeBusiness = async ({ event_id, ...event_updates }) => {
    const updated_event = await AxiosInstance.put(`/events/business/remove/${event_id}`, event_updates)

    return updated_event
}

//! useEventsQuery - fetch all events
const getAllEvents = async () => {
    const events_api_call = await AxiosInstance.get('/events')

    return events_api_call
}
export const useEventsQuery = () => useQuery(["events"], getAllEvents, { refetchOnMount: false })

export const useEventQuery = (id) => useQuery(["event", id], () => getEvent(id), { staleTime: 60000, refetchOnMount: false })
export const useUserEventsQuery = (user_id) => useQuery(["events", "user", user_id], () => getAllUserEvents(user_id), { staleTime: 60000, refetchOnMount: false })
export const useBusinessEventsQuery = (business_id) => useQuery(['events', 'business', business_id], () => getAllBusinessEvents(business_id), { staleTime: 6000, refetchOnMount: false })

//! useAddEventMutation - create new event
const addEvent = async (event) => {
    const new_event = await AxiosInstance.post('/events', event)

    return new_event
}
export const useAddEventMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(addEvent, {
        onSuccess: () => {
            queryClient.cancelQueries('events')
        },
        onError: (error) => {
            console.log('error inside add event mutation')
            // console.log(error)
        },
        onSettled: () => queryClient.refetchQueries('events')
    })
}

//! useEditEventMutation - update event
const updateEvent = async ({ event_id, ...event_updates }) => {
    return await AxiosInstance.put(`/events/${event_id}`, event_updates)
}
export const useEditEventMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(updateEvent, {
        onSuccess: ({ data }) => {
            queryClient.cancelQueries(['event', data.event_id])
            queryClient.cancelQueries('events')
            queryClient.refetchQueries(['event', data.event_id])
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => {
            queryClient.refetchQueries('events')
        }
    })
}

export const useBusinessRemoveMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeBusiness, {
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries(['event', data.id])
            queryClient.invalidateQueries('events')
        },
        onError: (error) => {
            console.log('error inside event business remove mutation')
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries('events')
    })
}

export const useEventRemoveMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeEvent, {
        onSuccess: () => {
            queryClient.cancelQueries('events')
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries('events')
    })
}