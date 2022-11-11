import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { withRouter, useHistory } from 'react-router-dom';

import AxiosInstance from '../../helpers/axios';
import { UsersContext } from '../../context/users/users.provider';
import AccountDetails from './accountTab/accountDetails';
import CreateBusinessButton from '../business/buttons/createBusinessButton';


const Profile = () => {
    const { setProfile } = useContext(UsersContext);
    const [ loading, setLoading ] = useState(false);
    
    let navigate = useNavigate()

    const getUser = useCallback(() => {
        setLoading(true);

        AxiosInstance.get('/auth/user_profile')
            .then(response => {
                console.log(response)
                setProfile(response.data)
            })
            .catch(err => {
                if(err.response.status === 401) {
                    navigate('/login')
                }
            })
            .finally(
                setLoading(false)
            )
            // eslint-disable-next-line 
    }, [])

    useEffect(() => {
        const user = localStorage.getItem('user')
        console.log(user)
        if(!user) {
            getUser()
        }
        // eslint-disable-next-line 
    }, [])

    if(loading) {
        return <div>loading...</div>
    }


    return (
        <div>
            <AccountDetails />
            <CreateBusinessButton />
        </div>
    )
}

export default Profile;