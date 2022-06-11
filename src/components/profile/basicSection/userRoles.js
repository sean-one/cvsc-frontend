import React, { useContext } from 'react';

import { UsersContext } from '../../../context/users/users.provider';


const UserRoles = () => {
    const { userRoles } = useContext(UsersContext)

    console.log(userRoles)
    return (
        <p>this will be the user roles list</p>
    )
}

export default UserRoles;