import { useQuery } from "react-query";
import AxiosInstance from "../helpers/axios";

const getAllBusinesses = async () => {
    const businesses_api_call = await AxiosInstance.get('/businesses')

    return businesses_api_call
}

const getBusiness = async (id) => {
    const single_business = await AxiosInstance.get(`/business/${id}`)

    return single_business
}

export const useBusinessesQuery = () => useQuery(["businesses"], getAllBusinesses, { refetchOnMount: false })
export const useBusinessQuery = (id) => useQuery(["business", id], () => getBusiness(id))