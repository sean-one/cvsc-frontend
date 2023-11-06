import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";
import useAuth from "./useAuth";
import useNotification from "./useNotification";
 

// return an array of all events related to business id
const getBusinessEvents = async (business_id) => { return await AxiosInstance.get(`/events/business/${business_id}`) }
export const useBusinessEventsQuery = (business_id) => {
    
    return useQuery(["business_events", business_id], () => getBusinessEvents(business_id), {
        refetchOnMount: false,
        onError: (error) => {
            console.log('error inside the useBusinessEventsQuery')
            console.log(error)
        }
    })
}

// return an array of all events related to user id
const getAllUserEvents = async (user_id) => { return await AxiosInstance.get(`/events/user/${user_id}`) }
export const useUserEventsQuery = (user_id) => {
    const { setAuth } = useAuth()
    let navigate = useNavigate()

    return useQuery(["events", "user", user_id], () => getAllUserEvents(user_id), {
        staleTime: 60000,
        refetchOnMount: false,
        onError: (error) => {
            if (error?.response.status === 401) {
                localStorage.removeItem('jwt')
                setAuth({})
                navigate('/login')
            }
        }
    })
}

// event.view, event.edit.view - return a single event by event id
const getEvent = async (event_id) => { return await AxiosInstance.get(`/events/${event_id}`) }
export const useEventQuery = (event_id) => useQuery(['events', event_id], () => getEvent(event_id), { staleTime: 60000, refetchOnMount: false })

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
            queryClient.refetchQueries(['inactive', 'events', 'event', 'user', data.event_id])
        },
        onError: (error) => {
            console.log(error)
        },
    })
}

// business.label - remove_event_business
const removeBusiness = async ({ event_id, business_id }) => { return await AxiosInstance.put(`/events/businesses/${business_id}/events/${event_id}`) }
export const useRemoveEventBusinessMutation = () => {
    const queryClient = useQueryClient();
    const { setAuth } = useAuth();
    const { dispatch } = useNotification();
    let navigate = useNavigate();

    return useMutation(removeBusiness, {
        onSuccess: ({ data }) => {
            queryClient.refetchQueries(['events'])
            queryClient.refetchQueries(['events', data.event_id])
            queryClient.refetchQueries(['business_events', data.business_id])

            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: 'business successfully removed'
                }
            })

            navigate(-1)
        },
        onError: (error) => {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })

            if (error?.response?.status === 401) {
                localStorage.removeItem('jwt');
                setAuth({});
                navigate('/login')
            }
        },
    })
}

// event.edit.form - remove_event
const removeEvent = async (event_id) => { return await AxiosInstance.delete(`/events/${event_id}`) }
export const useRemoveEventMutation = () => {
    const queryClient = useQueryClient();
    const { setAuth } = useAuth();
    const { dispatch } = useNotification();
    let navigate = useNavigate();

    return useMutation(removeEvent, {
        onSuccess: ({ data }) => {
            queryClient.refetchQueries(['events'])
            queryClient.refetchQueries(['events', data.event_id])
            queryClient.refetchQueries(['events', 'user', data.user_id])
            queryClient.refetchQueries(['business_events', data.venue_id])
            queryClient.refetchQueries(['business_events', data.brand_id])
        },
        onError: (error) => {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })

            if (error?.response?.status === 401) {
                localStorage.removeItem('jwt');
                setAuth({});
                navigate('/login', { state: { from: `/profile/events` } });
            }
        },
    })
}