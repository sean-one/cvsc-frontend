import React from 'react';
import { Outlet } from 'react-router-dom';

import UserAccount from './account/user.account';
import ProfileMenu from './profile.menu';


const Profile = () => {

    return (
        <div>
            <UserAccount />
            <ProfileMenu />
            <Outlet />
        </div>
    )
}

export default Profile;