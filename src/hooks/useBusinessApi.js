import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";


//! businessView, update.business - VIEW BUSINESS PAGE
const getBusiness = async (id) => { return await AxiosInstance.get(`/business/single/${id}`) }
export const useBusinessQuery = (id) => useQuery(['businesses', 'business' , id], () => getBusiness(id))

// business_list, role.request
const getBusinesses = async () => { return await AxiosInstance.get('/business') }
export const useBusinessesQuery = () => useQuery(['businesses'], getBusinesses,{ refetchOnMount: false })

// business.create.form
const createBusiness = async (business) => { return await AxiosInstance.post('/business/create', business) }
export const useCreateBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(createBusiness, {
        onSuccess: () => {
            queryClient.invalidateQueries(['businesses', 'roles'])
            queryClient.refetchQueries('businesses')
        },
        onError: (error, new_business, context) => {
            console.log(error)
        },
        onSettled: () => {
            queryClient.refetchQueries(['businesses', 'roles'])
        },
    })
}

// business.edit.form
const updateBusiness = async ({ business_id, business_updates }) => { return await AxiosInstance.put(`/business/update/${business_id}`, business_updates) }
export const useUpdateBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(updateBusiness, {
        onSuccess: () => {
            queryClient.cancelQueries(['business'])
            queryClient.cancelQueries(['events'])
            queryClient.refetchQueries(['events'])
        },
        onError: (error, updated_business, context) => { console.log(error) },
        onSettled: () => {
            queryClient.refetchQueries(['business'])
        }
    })
}

// business.admin.menu
const removeBusiness = async (business_id) => { return await AxiosInstance.delete(`/business/remove/${business_id}`) }
export const useRemoveBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeBusiness, {
        onSuccess: () => {
            queryClient.invalidateQueries(['business', 'events'])
            queryClient.refetchQueries(['business', 'events'])
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries(['business', 'events'])
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
            queryClient.invalidateQueries(['businesses', 'business', data.id, 'roles'])
            queryClient.refetchQueries('businesses')
        },
        onError: (error, updated_business, context) => { console.log(error) },
        onSettled: ({ data }) => {
            queryClient.refetchQueries(['businesses', 'business', data.id, 'roles'])
        }
    })
}