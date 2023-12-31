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
    const { setAuth } = useAuth();
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

// return an array of all events related to business id
// ['business_events', business_id]
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
// ['user_events', user_id]
const getAllUserEvents = async (user_id) => { return await AxiosInstance.get(`/events/user/${user_id}`) }
export const useUserEventsQuery = (user_id) => {
    const { setAuth } = useAuth()
    let navigate = useNavigate()

    return useQuery(["user_events", user_id], () => getAllUserEvents(user_id), {
        staleTime: 60000,
        refetchOnMount: false,
        onError: (error) => {
            if (error?.response?.status === 401) {
                localStorage.removeItem('jwt')
                setAuth({})
                navigate('/login')
            }
        }
    })
}

// event.view, event.edit.view - return a single event by event id
// ['events', event_id]
const getEvent = async (event_id) => { return await AxiosInstance.get(`/events/${event_id}`) }
export const useEventQuery = (event_id) => {
    const { dispatch } = useNotification()
    let navigate = useNavigate()

    return useQuery(['events', event_id], () => getEvent(event_id), {
        staleTime: 60000,
        refetchOnMount: false,
        onError: (error) => {
            if (error?.response?.status === 404) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })
            } else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'An error has occurred in the event fetch'
                    }
                })
            }
            navigate('/');
        }
    })
}

// event.edit.form - update_event - UPDATE EVENT
// refetch -> ['events'], ['business_events'], ['user_events']
const updateEvent = async ({ event_updates, event_id }) => { return await AxiosInstance.put(`/events/${event_id}`, event_updates) }
export const useUpdateEventMutation = () => {
    const queryClient = useQueryClient();
    const { dispatch } = useNotification();
    const { auth, setAuth } = useAuth();
    let navigate = useNavigate();

    return useMutation(updateEvent, {
        onSuccess: ({ data }) => {
            queryClient.refetchQueries(['events'])
            queryClient.refetchQueries(['business_events'])
            queryClient.refetchQueries(['user_events', auth?.user?.id])
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
// refetch -> ['events'], ['business_events'], ['user_events']
const removeEvent = async (event_id) => { return await AxiosInstance.delete(`/events/${event_id}`) }
export const useRemoveEventMutation = () => {
    const queryClient = useQueryClient();
    const { auth, setAuth } = useAuth();
    const { dispatch } = useNotification();
    let navigate = useNavigate();

    return useMutation(removeEvent, {
        onSuccess: ({ data }) => {
            queryClient.refetchQueries(['events'])
            queryClient.refetchQueries(['business_events'])
            queryClient.refetchQueries(['user_events', auth?.user?.id])
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
                navigate('/login');
            }
        },
    })
}

// get an array of all upcoming events
// ['events']
const getAllEvents = async () => { return await AxiosInstance.get('/events') }
export const useEventsQuery = () => {
    return useQuery(["events"], getAllEvents, {refetchOnMount: false,})
}

// event.create.form - CREATE A NEW EVENT
// refetch -> ['events'], ['business_events'], ['user_events']
const createEvent = async (event) => { return await AxiosInstance.post('/events', event) }
export const useCreateEventMutation = () => {
    const { auth, setAuth } = useAuth();
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
            if (error?.response?.status === 403) {
                if (error?.response?.data?.error?.type === 'token') {
                    localStorage.removeItem('jwt');
                    setAuth({});

                    navigate('/login');
                } else {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: error?.response?.data?.error?.message
                        }
                    })
                }
            }
        },
    })
}