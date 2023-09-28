import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";


const getAllUserEvents = async (user_id) => { return await AxiosInstance.get(`/events/user/${user_id}`) }
export const useUserEventsQuery = (user_id) => useQuery(["events", "user", user_id], () => getAllUserEvents(user_id), { staleTime: 60000, refetchOnMount: false })

// business_label - remove_event_business
const removeBusiness = async ({ event_id, ...event_updates }) => { return await AxiosInstance.put(`/events/remove_business/${event_id}`, event_updates) }
export const useRemoveEventBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeBusiness, {
        onSuccess: ({ data }) => {
            queryClient.cancelQueries(['event', data.id])
            queryClient.cancelQueries(['businesses'])
            queryClient.refetchQueries(['businesses'])
        },
        onError: (error) => {
            console.log('error inside event business remove mutation')
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries(['events'])
    })
}

// event.view
const getEvent = async (id) => { return await AxiosInstance.get(`/events/${id}`) }
export const useEventQuery = (id) => useQuery(['events', id], () => getEvent(id), { staleTime: 60000, refetchOnMount: false })

// related.events
const getAllEvents = async () => { return await AxiosInstance.get('/events') }
export const useEventsQuery = () => useQuery(["events"], getAllEvents, { refetchOnMount: false })

// const getBusinessEvents = async (id) => { return await AxiosInstance.get() }

//! event.create.form - CREATE A NEW EVENT
const createEvent = async (event) => { return await AxiosInstance.post('/events', event) }
export const useCreateEventMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(createEvent, {
        onSuccess: () => {
            queryClient.invalidateQueries(['events'])
            queryClient.refetchQueries('events')
        },
        onError: (error) => {
            console.log('error inside add event mutation')
            // console.log(error)
        },
        onSettled: () => queryClient.refetchQueries(['events'])
    })
}

//! event.edit.form - update_event - UPDATE EVENT
const updateEvent = async ({ event_updates, event_id }) => { return await AxiosInstance.post(`/events/update/${event_id}`, event_updates) }
export const useUpdateEventMutation = () => {
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

// event.edit.form - remove_event
const removeEvent = async (event_id) => { return await AxiosInstance.delete(`/events/remove/${event_id}`) }
export const useRemoveEventMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeEvent, {
        onSuccess: () => {
            queryClient.invalidateQueries(['events'])
            queryClient.refetchQueries(['events'])
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries('events')
    })
}