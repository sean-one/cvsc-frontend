import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";


//! useBusinessQuery - get single business by id
const getBusiness = async (id) => { return await AxiosInstance.get(`/business/${id}`) }
export const useBusinessQuery = (id) => useQuery(["businesses", 'business' , id], () => getBusiness(id))


//! useBusinessQuery - get all businesses
const getBusinesses = async () => { return await AxiosInstance.get('/business') }
export const useBusinessesQuery = () => useQuery(["businesses"], getBusinesses,{ refetchOnMount: false })


//! useCreateBusinessMutation - create new business
const createBusiness = async (business) => { return await AxiosInstance.post('/business/create', business) }
export const useCreateBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(createBusiness, {
        onSuccess: () => {
            queryClient.invalidateQueries('businesses')
            queryClient.refetchQueries('businesses')
        },
        onError: (error, new_business, context) => {
            console.log(error)
        },
        onSettled: () => {
            queryClient.refetchQueries('businesses')
        },
    })
}

//! useUpdateBusinessMutation - updated existing business
const updateBusiness = async ({ business_id, business_updates }) => { return await AxiosInstance.put(`/business/update/${business_id}`, business_updates) }
export const useUpdateBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(updateBusiness, {
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries(['business', data.id, 'events'])
        },
        onError: (error, updated_business, context) => { console.log(error) },
        onSettled: ({ data }) => {
            queryClient.refetchQueries(['business', data.id, 'events'])
        }
    })
}

//! useBusinessRequestToggle - toggle business_request_open
const toggleBusinessRequest = async (id) => { return await AxiosInstance.put(`/business/toggle-request/${id}`) }
export const useBusinessRequestToggle = () => {
    const queryClient = useQueryClient()
    return useMutation(toggleBusinessRequest, {
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries(['businesses', 'business', data.id])
            queryClient.refetchQueries('businesses')
        },
        onError: (error, updated_business, context) => { console.log(error) },
        onSettled: ({ data }) => {
            queryClient.refetchQueries(['businesses', 'business', data.id])
        }
    })
}

//! useActiveBusinessToggle - toggle active_business
const toggleActiveBusiness = async (id) => { return await AxiosInstance.put(`/business/toggle-active/${id}`) }
export const useActiveBusinessToggle = () => {
    const queryClient = useQueryClient()
    return useMutation(toggleActiveBusiness, {
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries(['businesses', 'business', data.id])
            queryClient.refetchQueries('businesses')
            // queryClient.invalidateQueries(['business_roles', data.id])
            // queryClient.invalidateQueries('pending_roles')
        },
        onError: (error, updated_business, context) => { console.log(error) },
        onSettled: ({ data }) => {
            queryClient.refetchQueries(['businesses', 'business', data.id])
            // queryClient.refetchQueries(['business_roles', data.id])
            // queryClient.refetchQueries('pending_roles')
        }
    })
}