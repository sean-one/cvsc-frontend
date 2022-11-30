import React from 'react';
import { Outlet } from 'react-router-dom';

import AccountDetails from './accountTab/accountDetails';
import ProfileMenu from './profileMenu';


const Profile = () => {

    return (
        <div>
            <AccountDetails />
            <ProfileMenu />
            <Outlet />
        </div>
    )
}

export default Profile;