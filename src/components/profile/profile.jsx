import React from 'react';
import { Outlet } from 'react-router-dom';

import AccountDetails from './accountTab/accountDetails';
import ProfileMenu from './profileMenu';
import CreateBusinessButton from '../business/buttons/createBusinessButton';
import CreateEventButton from '../events/buttons/createEventButton';


const Profile = () => {

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center py-2'>
                <CreateBusinessButton />
                <CreateEventButton />
            </div>
            <AccountDetails />
            <ProfileMenu />
            <Outlet />
        </div>
    )
}

export default Profile;