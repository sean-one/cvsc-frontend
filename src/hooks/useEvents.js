import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";


const getAllEvents = async () => {
    const events_api_call = await AxiosInstance.get('/events')
    
    return events_api_call
}

const getEvent = async (id) => {
    const single_event = await AxiosInstance.get(`/events/${id}`)
    console.log(single_event)

    return single_event
}

const addEvent = async (event) => {
    const new_event = await AxiosInstance.post('/events', event)

    return new_event
}

const updateEvent = async ({ event_id, ...event_updates }) => {
    const token = localStorage.getItem('token')
    const updated_event = await AxiosInstance.put(`/events/${event_id}`, event_updates, { headers: { 'Authorization': 'Bearer ' + token } })

    return updated_event
}

const removeEvent = async (event_id) => {
    const token = localStorage.getItem('token')
    const removed_event_count = await AxiosInstance.delete(`/events/remove/${event_id}`, { headers: { 'Authorization': 'Bearer ' + token } })

    return removed_event_count
}

export const useEventsQuery = () => useQuery(["events"], getAllEvents, { refetchOnMount: false })
export const useEventQuery = (id) => useQuery(["event", id], () => getEvent(id), { staleTime: 60000, refetchOnMount: false })

export const useAddEventMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(addEvent, {
        onSuccess: () => {
            queryClient.cancelQueries('events')
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries('events')
    })
}

export const useEditEventMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(updateEvent, {
        onSuccess: () => {
            queryClient.cancelQueries('events')
        },
        onError: (error) => {
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