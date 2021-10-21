import React from 'react';

import PendingRequest from './pendingRequest/pendingRequest';

import './adminSection.css';

const AdminSection = (props) => {

    return (
        <div className='adminSection'>
            <PendingRequest />
        </div>
    )
}

export default AdminSection;