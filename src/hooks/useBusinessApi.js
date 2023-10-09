import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";


//! businessView, update.business - VIEW BUSINESS PAGE
const getBusiness = async (id) => { return await AxiosInstance.get(`/businesses/single/${id}`) }
export const useBusinessQuery = (id) => useQuery(['businesses', 'business' , id], () => getBusiness(id))

//! RETURN A LIST OF ALL BUSINESSES
const getBusinesses = async () => { return await AxiosInstance.get('/businesses') }
export const useBusinessesQuery = () => useQuery(['businesses'], getBusinesses,{ refetchOnMount: false })

//! business.create.form - CREATE BUSINESS
const createBusiness = async (business) => { return await AxiosInstance.post('/businesses/create', business) }
export const useCreateBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(createBusiness, {
        onSuccess: () => {
            queryClient.refetchQueries(['businesses', 'roles'])
        },
        onError: (error, new_business, context) => {
            console.log(error)
        },
    })
}

//! business.edit.form - EDIT BUSINESS
const updateBusiness = async ({ business_id, business_updates }) => { return await AxiosInstance.put(`/businesses/update/${business_id}`, business_updates) }
export const useUpdateBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(updateBusiness, {
        onSuccess: () => {
            queryClient.refetchQueries(['businesses', 'business', 'events'])
        },
        onError: (error, updated_business, context) => { console.log(error) },
    })
}

//! business.admin.view - REMOVES BUSINESS & INVALIDATES ANY UPCOMING EVENT
const removeBusiness = async (business_id) => { return await AxiosInstance.delete(`/businesses/remove/${business_id}`) }
export const useRemoveBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeBusiness, {
        onSuccess: ({ data }) => {
            queryClient.refetchQueries(['businesses', 'business', 'roles', 'events', data.business_id])
        },
        onError: (error) => {
            console.log(error)
        },
    })
}

//! business.admin.menu - TOGGLE BUSINESS REQUEST STATUS
const toggleBusinessRequest = async (id) => { return await AxiosInstance.put(`/businesses/toggle-request/${id}`) }
export const useBusinessRequestToggle = () => {
    const queryClient = useQueryClient()
    return useMutation(toggleBusinessRequest, {
        onSuccess: ({ data }) => {
            queryClient.refetchQueries(['businesses', 'business', data.id])
        },
        onError: (error, updated_business, context) => { console.log(error) },
    })
}

//! business.admin.view - TOGGLE ACTIVE BUSINESS STATUS
const toggleActiveBusiness = async (id) => { return await AxiosInstance.put(`/businesses/toggle-active/${id}`) }
export const useActiveBusinessToggle = () => {
    const queryClient = useQueryClient()
    return useMutation(toggleActiveBusiness, {
        onSuccess: ({ data }) => {
            queryClient.refetchQueries(['businesses', 'business', data.id, 'roles'])
        },
        onError: (error, updated_business, context) => {
            console.log(Object.keys(error)) 
            console.log(error.response) 
        },
    })
}