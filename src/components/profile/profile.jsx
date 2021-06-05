import React, { useContext } from 'react';

import UserContext from '../../context/userContext';

const Profile = () => {
    const { userProfile } = useContext(UserContext);
    console.log(userProfile)

    return (
        <div className='userProfile'>
            <h1>welcome to your profile</h1>
        </div>
    )
}

export default Profile;