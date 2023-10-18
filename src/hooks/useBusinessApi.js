import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";


// businessView, update.business - VIEW BUSINESS PAGE
const getBusiness = async (id) => { return await AxiosInstance.get(`/businesses/${id}`) }
export const useBusinessQuery = (id) => useQuery(['businesses', 'business' , id], () => getBusiness(id))

// return All businesses
const getBusinesses = async () => { return await AxiosInstance.get('/businesses') }
export const useBusinessesQuery = () => useQuery(['businesses'], getBusinesses,{ refetchOnMount: false })

// business.create.form - CREATE BUSINESS
const createBusiness = async (business) => { return await AxiosInstance.post('/businesses', business) }
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

// business.admin.menu - toggle active & toggle request
const toggleBusiness = async ({ business_id, toggle_type }) => { return await AxiosInstance.put(`/businesses/${business_id}/toggle`, toggle_type) }
export const useBusinessToggle = () => {
    const queryClient = useQueryClient()
    return useMutation(toggleBusiness, {
        onSuccess: ({ data }) => {
            queryClient.refetchQueries(['businesses', 'business', data.id])
        },
        onError: (error, business_error, context) => { console.log(error) },
    })
}

// business.edit.form - EDIT BUSINESS
const updateBusiness = async ({ business_id, business_updates }) => { return await AxiosInstance.put(`/businesses/${business_id}`, business_updates) }
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
const removeBusiness = async (business_id) => { return await AxiosInstance.delete(`/businesses/${business_id}`) }
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