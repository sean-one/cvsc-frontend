import { useMutation, useQuery, useQueryClient } from "react-query";
import AxiosInstance from "../helpers/axios";


const getAllBusinesses = async () => {
    const businesses_api_call = await AxiosInstance.get('/business')
    
    return businesses_api_call
}

const getBusiness = async (id) => {
    const single_business = await AxiosInstance.get(`/business/${id}`)
    
    return single_business
}

const getBusinessLocation = async (business_id) => {
    const business_location = await AxiosInstance.get(`/locations/business/${business_id}`)

    return business_location
}

const updateBusiness = async ({ business_id, ...business_updates }) => {
    const updated_business = await AxiosInstance.put(`/business/${business_id}`, business_updates)

    return updated_business;
}

const updateLocation = async ({ location_id, ...location_updates }) => {
    const updated_location = await AxiosInstance.put(`/locations/${location_id}`, location_updates)

    return updated_location;
}

const createBusiness = async (business) => {
    const token = localStorage.getItem('token')
    const new_business = await AxiosInstance.post('/business/create', business, { headers: { 'Authorization': 'Bearer ' + token } })

    return new_business
}

const upgradeCreator = async (role_id) => {
    const token = localStorage.getItem('token')
    const new_manager = await AxiosInstance.post(`/roles/upgrade_creator/${role_id}`, { headers: { 'Authorization': 'Bearer ' + token } })
    
    return new_manager
}

const downgradeManager = async (role_id) => {
    const token = localStorage.getItem('token')
    const updated_role = await AxiosInstance.post(`/roles/downgrade_manager/${role_id}`, { headers: { 'Authorization': 'Bearer ' + token } })

    return updated_role
}

const approvePendingRole = async (role_id) => {
    const token = localStorage.getItem('token')
    const new_creator = await AxiosInstance.post(`/roles/approve_pending/${role_id}`, { headers: { 'Authorization': 'Bearer ' + token } })
    
    return new_creator
}

const removeUserRole = async (role_id) => {
    const token = localStorage.getItem('token')
    const removed_role_count = await AxiosInstance.delete(`/roles/user_remove/${role_id}`, { headers: { 'Authorization': 'Bearer ' + token } })

    return removed_role_count
}

const removeManagerRole = async (role_id) => {
    const token = localStorage.getItem('token')
    const removed_role_count = await AxiosInstance.delete(`/roles/manager_remove/${role_id}`, { headers: { 'Authorization': 'Bearer ' + token } })

    return removed_role_count
}

const getAllPendingRoles = async () => {
    const pending_roles = await AxiosInstance.get(`/roles/management/pending`)

    return pending_roles
}

const getAllBusinessRoles = async (id) => {
    const token = localStorage.getItem('token')
    const business_roles = await AxiosInstance.get(`/roles/business/${id}`, { headers: { 'Authorization': 'Bearer ' + token } })

    return business_roles
}

const toggleActiveBusiness = async (id) => {
    const updated_business = await AxiosInstance.put(`/business/toggle-active/${id}`)

    return updated_business
}

const toggleBusinessRequestStatus = async (id) => {
    const updated_business = await AxiosInstance.put(`/business/toggle-request/${id}`)

    return updated_business
}


export const useBusinessesQuery = () => useQuery(["businesses"], getAllBusinesses, { refetchOnMount: false })
export const useBusinessQuery = (id) => useQuery(["business", id], () => getBusiness(id))
export const useBusinessLocationQuery = (business_id) => useQuery(["business_location", business_id], () => getBusinessLocation(business_id))
export const useBusinessRolesQuery = (id) => useQuery(['business_roles', id], () => getAllBusinessRoles(id))
export const usePendingRolesQuery = () => useQuery(['pending_roles'], () => getAllPendingRoles())

export const useAddBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(createBusiness, {
        onSuccess: () => {
            queryClient.invalidateQueries('businesses')
        },
        onError: (error, new_business, context) => {
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries('businesses'),
    })
}

export const useUpdateBusinessMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(updateBusiness, {
        onSuccess: ({ data }) => { queryClient.invalidateQueries(['business', data.id]) },
        onError: (error, updated_business, context) => { console.log(error) },
        onSettled: ({ data }) => { queryClient.refetchQueries(['business', data.id]) }
    })
}

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
            queryClient.invalidateQueries(['businesses', data.id])
        },
        onError: (error, updated_business, context) => { console.log(error) },
        onSettled: ({ data }) => {
            queryClient.refetchQueries(['businesses', data.id])
        }
    })
}

export const useBusinessRequestMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(toggleBusinessRequestStatus, {
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries(['business', data.id])
        },
        onError: (error, updated_business, context) => { console.log(error) },
        onSettled: ({ data }) => {
            queryClient.refetchQueries(['businesses', data.id])
        }
    })
}

//-----------------------------------------
//  business role mutations
//-----------------------------------------

// approves pending role request and adjust 'active_role: true'
export const usePendingRoleMutation = () => {
    const queryClient = useQueryClient()
    return useMutation(approvePendingRole, {
        onSuccess: () => {
            queryClient.invalidateQueries('business_roles')
            queryClient.invalidateQueries('pending_roles')
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries('business_roles'),
        onSettled: () => queryClient.refetchQueries('pending_roles'),
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
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries('business_roles'),
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
        onSettled: () => queryClient.refetchQueries('business_roles'),
    })
}