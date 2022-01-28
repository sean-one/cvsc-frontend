import React, { useState } from 'react'

import PendingRequest from '../pendingRequest/pendingRequest'
import EditRoles from '../editRoles/editRoles'

const RolesTab = () => {
    const [pendingRequestVisable, setPendingRequestVisable] = useState(false)
    const [editRolesVisable, setEditRolesVisable] = useState(false)

    const togglePendingRequest = () => {
        setPendingRequestVisable(!pendingRequestVisable)
    }

    const toggleEditRoles = () => {
        setEditRolesVisable(!editRolesVisable)
    }

    return (
        <div>
            <PendingRequest viewable={pendingRequestVisable} toggleView={togglePendingRequest} />
            <EditRoles viewable={editRolesVisable} toggleView={toggleEditRoles} />
        </div>
    )
}

export default RolesTab;