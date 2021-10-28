import React from 'react';

import RolesTab from './rolesTab/rolesTab';

import './adminSection.css';

const AdminSection = (props) => {

    return (
        <div className='adminSection'>
            <RolesTab />
        </div>
    )

}

export default AdminSection;