import React from 'react'

import MFASetUp from './mfa_setup';

import useAuth from '../../../hooks/useAuth';

const SquirrelMaster = () => {
    const { auth } = useAuth();

    console.log(auth?.user)
    return (
        <div>
            Welcome Squirrel Master!
            <MFASetUp />
        </div>
    )
}

export default SquirrelMaster;