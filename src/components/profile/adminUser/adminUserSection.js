import React, { useState } from 'react';

import PendingBusiness from './pendingBusiness/pendingBusiness';

const AdminUser = (props) => {
    const [ pendingBusinessVisable, setPendingBusinessVisable ] = useState(false)

    const togglePendingBusiness = () => {
        setPendingBusinessVisable(!pendingBusinessVisable)
    }

    return (
        <div className='adminSection'>
            <div className='sectionHeader'>
                <h3>Admin User</h3>
            </div>
            <div className='sectionTabs'>
                <PendingBusiness viewable={pendingBusinessVisable} toggleView={togglePendingBusiness} />
            </div>
        </div>
    )
}

export default AdminUser;