import { useQuery } from "react-query";
import AxiosInstance from "../helpers/axios";


const getAllEvents = async () => {
    const events_api_call = await AxiosInstance.get('/events')
    
    return events_api_call
}

const getEvent = async (id) => {
    const single_event = await AxiosInstance.get(`/events/${id}`)

    return single_event
}

export const useEventsQuery = () => useQuery(["events"], getAllEvents, { refetchOnMount: false })
export const useEventQuery = (id) => useQuery(["event", id], () => getEvent(id))