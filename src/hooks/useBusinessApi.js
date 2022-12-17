import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";


//! useBusinessQuery - get single business by id
const getBusiness = async (id) => { return await AxiosInstance.get(`/business/${id}`) }
export const useBusinessQuery = (id) => useQuery(["business", id], () => getBusiness(id))


//! useBusinessQuery - get all businesses
const getBusinesses = async () => { return await AxiosInstance.get('/business') }
export const useBusinessesQuery = () => useQuery(["businesses"], getBusinesses,{ refetchOnMount: false })


//! useAddBusinessMutation - create new business
const createBusiness = async (business) => { return await AxiosInstance.post('/business/create', business) }
export const useAddBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(createBusiness, {
        onSuccess: () => {
            queryClient.invalidateQueries('businesses')
            queryClient.refetchQueries('businesses')
        },
        onError: (error, new_business, context) => {
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries('businesses'),
    })
}

//! useUpdateBusinessMutation - updated existing business
const updateBusiness = async ({ business_id, business_updates }) => { return await AxiosInstance.put(`/business/${business_id}`, business_updates) }
export const useUpdateBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(updateBusiness, {
        onSuccess: ({ data }) => { queryClient.invalidateQueries(['business', data.id]) },
        onError: (error, updated_business, context) => { console.log(error) },
        onSettled: ({ data }) => { queryClient.refetchQueries(['business', data.id]) }
    })
}


const getBusinessLocation = async (business_id) => { return await AxiosInstance.get(`/locations/business/${business_id}`) }
const updateLocation = async ({ location_id, ...location_updates }) => { return await AxiosInstance.put(`/locations/${location_id}`, location_updates) }
const upgradeCreator = async (role_id) => { return await AxiosInstance.post(`/roles/upgrade_creator/${role_id}`) }
const downgradeManager = async (role_id) => { return await AxiosInstance.post(`/roles/downgrade_manager/${role_id}`) }
const approveRequest = async (role_id) => { return await AxiosInstance.post(`/roles/approve_request/${role_id}`) }
const removeUserRole = async (role_id) => { return await AxiosInstance.delete(`/roles/user_remove/${role_id}`) }
const removeManagerRole = async (role_id) => { return await AxiosInstance.delete(`/roles/manager_remove/${role_id}`) }
const getAllPendingRoles = async () => { return await AxiosInstance.get(`/roles/management/pending`) }
const getAllBusinessRoles = async (id) => { return await AxiosInstance.get(`/roles/business/${id}`) }
const toggleActiveBusiness = async (id) => { return await AxiosInstance.put(`/business/toggle-active/${id}`) }
const toggleBusinessRequestStatus = async (id) => { return await AxiosInstance.put(`/business/toggle-request/${id}`) }


export const useBusinessLocationQuery = (business_id) => useQuery(["business_location", business_id], () => getBusinessLocation(business_id))

export const useBusinessRolesQuery = (id) => useQuery(['business_roles', id], () => getAllBusinessRoles(id))
export const usePendingRolesQuery = () => useQuery(['pending_roles'], () => getAllPendingRoles())



export const useLocationMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(updateLocation, {
        onSuccess: ({ data }) => { queryClient.invalidateQueries(['business_location', data.venue_id])},
        onError: (error, updated_location, context) => { console.log(error) },
        onSettled: ({ data }) => { queryClient.refetchQueries(['business_location', data.venue_id]) }
    })
}

export const useActiveBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(toggleActiveBusiness, {
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries(['business', data.id])
            queryClient.invalidateQueries(['businesses'])
            queryClient.invalidateQueries(['business_roles', data.id])
            queryClient.invalidateQueries('pending_roles')
        },
        onError: (error, updated_business, context) => { console.log(error) },
        onSettled: ({ data }) => {
            queryClient.refetchQueries(['business', data.id])
            queryClient.refetchQueries(['businesses'])
            queryClient.refetchQueries(['business_roles', data.id])
            queryClient.refetchQueries('pending_roles')
        }
    })
}

export const useBusinessRequestMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(toggleBusinessRequestStatus, {
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries(['business', data.id])
            queryClient.invalidateQueries('businesses')
        },
        onError: (error, updated_business, context) => { console.log(error) },
        onSettled: ({ data }) => {
            queryClient.refetchQueries(['business', data.id])
            queryClient.refetchQueries('businesses')
        }
    })
}

//-----------------------------------------
//  business role mutations
//-----------------------------------------

// approves pending role request and adjust 'active_role: true'
export const useRequestApprovalMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(approveRequest, {
        onSuccess: () => {
            queryClient.invalidateQueries('business_roles')
            queryClient.invalidateQueries('pending_roles')
        },
        onError: (error) => {
            console.log(Object.keys(error))
            console.log(error.response)
        },
        onSettled: () => {
            queryClient.refetchQueries('business_roles')
            queryClient.refetchQueries('pending_roles')
        },
})}

// upgrades 'creator' role to a 'manager' role
export const useCreatorUpgradeMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(upgradeCreator, {
        onSuccess: () => {
            queryClient.invalidateQueries('business_roles')
        },
        onError: (error) => {
            console.log(Object.keys(error))
            console.log(error.response)
        },
        onSettled: () => queryClient.refetchQueries('business_roles'),
    })
}

// downgrades 'manager' role to a 'creator' role
export const useManagerDowngradeMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(downgradeManager, {
        onSuccess: () => {
            queryClient.invalidateQueries('business_roles')
        },
        onError: (error) => {
            console.log(Object.keys(error))
            console.log(error.response)
        },
        onSettled: () => queryClient.refetchQueries('business_roles'),
    })
}

// removes 'creator' and 'active_role: false' roles ONLY
export const useUserRoleDeleteMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeUserRole, {
        onSuccess: () => {
            queryClient.invalidateQueries('business_roles')
            queryClient.invalidateQueries('pending_roles')
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => {
            queryClient.refetchQueries('business_roles')
            queryClient.refetchQueries('pending_roles')
        },
    })
}

// removes 'manager' role
export const useManagerRoleDeleteMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(removeManagerRole, {
        onSuccess: () => {
            queryClient.invalidateQueries('business_roles')
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => {
            queryClient.refetchQueries('business_roles')
        },
    })
}