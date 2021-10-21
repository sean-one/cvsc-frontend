import React, { useState } from 'react';

import PendingRequest from './pendingRequest/pendingRequest';

import './adminSection.css';

const AdminSection = (props) => {
    const [ pendingRequestVisable, setPendingRequestVisable ] = useState(true)

    const togglePendingRequest = () => {
        setPendingRequestVisable(!pendingRequestVisable)
    }

    return (
        <div className='adminSection'>
            <PendingRequest viewable={pendingRequestVisable} toggleView={togglePendingRequest} />
        </div>
    )
}

export default AdminSection;