import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";

const getBusinessRoles = async (business_id) => { return await AxiosInstance.get(`/roles/business/${business_id}`) }
export const useBusinessRolesQuery = (business_id) => useQuery(['roles', 'business', business_id], () => getBusinessRoles(business_id))

const removeRole = async (role_id) => { return await AxiosInstance.delete(`/roles/remove/${role_id}`) }
export const useRemoveRoleMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeRole, {
        onSuccess: () => {
            queryClient.invalidateQueries(['roles', 'business'])
            queryClient.refetchQueries(['roles'])
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => {
            queryClient.refetchQueries(['roles', 'business'])
        },
    })
}