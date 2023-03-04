import React from 'react';
import { Outlet } from 'react-router-dom';

import ProfileMenu from './profile.menu';


const Profile = () => {

    return (
        <div>
            <ProfileMenu />
            <Outlet />
        </div>
    )
}

export default Profile;