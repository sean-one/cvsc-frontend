import { useQuery } from "react-query";
import AxiosInstance from "../helpers/axios";


const getAllEvents = async () => {
    const events_api_call = await AxiosInstance.get('/events')
    
    return events_api_call
}

export const useEventsQuery = () => useQuery(["events"], getAllEvents, { refetchOnMount: false })