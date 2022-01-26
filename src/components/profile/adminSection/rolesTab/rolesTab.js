import React, { useState, useCallback, useContext } from 'react'
import AxiosInstance from '../../../../helpers/axios'

import PendingRequest from '../pendingRequest/pendingRequest'
import EditRoles from '../editRoles/editRoles'

import { UsersContext } from '../../../../context/users/users.provider'

const RolesTab = () => {
    const { useAdminRoles, setBusinessRoles } = useContext(UsersContext);
    const adminRoles = useAdminRoles()
    const [pendingRequestVisable, setPendingRequestVisable] = useState(false)
    const [editRolesVisable, setEditRolesVisable] = useState(false)

    const togglePendingRequest = () => {
        setPendingRequestVisable(!pendingRequestVisable)
    }

    const toggleEditRoles = () => {
        setEditRolesVisable(!editRolesVisable)
    }

    // passed to EDITROLES
    const getCurrentRoles = useCallback(() => {
        AxiosInstance.post('/roles/byBusinesses', adminRoles)
            .then(response => {
                setBusinessRoles(response.data)
                // console.log(response)

            })
            .catch(err => console.log(err))
        // eslint-disable-next-line    
    }, [])

    return (
        <div>
            <PendingRequest viewable={pendingRequestVisable} toggleView={togglePendingRequest} getRoles={getCurrentRoles} />
            <EditRoles viewable={editRolesVisable} toggleView={toggleEditRoles} getRoles={getCurrentRoles} />
        </div>
    )
}

export default RolesTab;