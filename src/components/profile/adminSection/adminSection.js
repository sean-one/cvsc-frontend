import React from 'react';

import { withViewToggle } from '../../../hoc/withViewToggle';
import EditRoles from './editRoles';
import PendingRequest from './pendingRequest';

import './adminSection.css';

const AdminSection = (props) => {
    const EditRolesTab = withViewToggle(EditRoles)
    const PendingRequestTab = withViewToggle(PendingRequest)

    return (
        <div className='adminSection'>
            <div className='sectionHeader'>
                <h3>Admin Options</h3>
            </div>
            <div className='sectionTabs'>
                <EditRolesTab />
                <PendingRequestTab />
            </div>
        </div>
    )

}

export default AdminSection;