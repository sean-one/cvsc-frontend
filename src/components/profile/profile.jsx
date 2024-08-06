import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import ProfileMenu from './profile.menu';
import UserAccount from './account/user.account';
import RolesTab from './roles/rolesTab';
import UserEventsRelated from './events/user.events.related';
import ManagementList from './management/management.list';
import SquirrelMaster from '../auth/mod/squirrel_master';


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
            case 'squirrelmaster':
                return <SquirrelMaster />
            default:
                return <UserAccount />
        }
    }

    
    return (
        <div>
            <Helmet>
                <title>CVSC - Account Profile</title>
            </Helmet>
            <ProfileMenu />
            {renderProfileSection()}
        </div>
    )
}

export default Profile;