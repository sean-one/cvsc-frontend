import React from 'react';

import RolesTab from './rolesTab/rolesTab';

import './adminSection.css';

const AdminSection = (props) => {

    return (
        <div className='adminSection'>
            <div className='sectionHeader'>
                <h3>Admin Options</h3>
            </div>
            <div className='sectionTabs'>
                <RolesTab />
            </div>
        </div>
    )

}

export default AdminSection;