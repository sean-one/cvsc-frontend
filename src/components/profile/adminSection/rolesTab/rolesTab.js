import React, { useState, useCallback, useContext } from 'react'
import AxiosInstance from '../../../../helpers/axios'

import PendingRequest from '../pendingRequest/pendingRequest'
import EditRoles from '../editRoles/editRoles'

import { UsersContext } from '../../../../context/users/users.provider'

const RolesTab = () => {
    const { useAdminRoles, setBusinessRoles, setPendingRequestList } = useContext(UsersContext);
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

    // passed to PENDINGREQUEST
    const getPendingList = useCallback(() => {
        const token = localStorage.getItem('token');
        // AxiosInstance.post('/pendingRequest/businesses', adminRoles)
        AxiosInstance.get('/roles/pending-request', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                setPendingRequestList(response.data)
                // console.log(response.data)
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            <PendingRequest viewable={pendingRequestVisable} toggleView={togglePendingRequest} getPending={getPendingList} getRoles={getCurrentRoles} />
            <EditRoles viewable={editRolesVisable} toggleView={toggleEditRoles} getRoles={getCurrentRoles} />
        </div>
    )
}

export default RolesTab;