import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";


// businessView, update.business
const getBusiness = async (id) => { return await AxiosInstance.get(`/business/single/${id}`) }
export const useBusinessQuery = (id) => useQuery(['businesses', 'business' , id], () => getBusiness(id))

// business_list, creatorRequest
const getBusinesses = async () => { return await AxiosInstance.get('/business') }
export const useBusinessesQuery = () => useQuery(['businesses'], getBusinesses,{ refetchOnMount: false })

// business.create.form
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

// business.edit.form
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

// business.admin.menu
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

// business.admin.menu
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