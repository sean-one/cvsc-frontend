import React from 'react';
import { useLocation } from 'react-router-dom';

import ProfileMenu from './profile.menu';
import UserAccount from './account/user.account';
import RolesTab from './roles/rolesTab';
import UserEventsRelated from './events/user.events.related';
import ManagementList from './management/management.list';


const Profile = () => {
    const location = useLocation();

    const renderProfileSection = () => {
        const path = location.pathname.split('/')[2];
        
        switch (path) {
            case 'roles':
                return <RolesTab />;
            case 'events':
                return <UserEventsRelated />
            case 'admin':
                return <ManagementList />
            default:
                return <UserAccount />
        }
    }

    return (
        <div>
            <ProfileMenu />
            {renderProfileSection()}
        </div>
    )
}

export default Profile;