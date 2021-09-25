import React from 'react';


import PendingRequest from './pendingRequest/pendingRequest';

const AdminSection = (props) => {
    return (
        <div className='adminSection'>
            <p>you have admin rights!</p>
            <PendingRequest />
        </div>
    )
}

export default AdminSection;