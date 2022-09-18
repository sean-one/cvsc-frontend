import React, { useState, useContext, useEffect, useCallback } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';
import { UsersContext } from '../../context/users/users.provider';
import AccountDetails from './accountTab/accountDetails';
import BusinessList from './managerTab/businessList';
import RolesTab from './rolesTab/rolesTab';
import UserEventsTab from './userEventsTab/userEventsTab';
import CreateBusinessButton from '../business/buttons/createBusinessButton';


const Profile = () => {
    const { userProfile, setUser, setAccountType } = useContext(UsersContext);
    const account_type = setAccountType();
    const [ loading, setLoading ] = useState(false);
    
    let history = useHistory()

    const getUser = useCallback(() => {
        setLoading(true);

        AxiosInstance.get('/auth/login/success')
            .then(response => {
                setUser(response.data)
            })
            .catch(err => {
                console.log(err)
                if(err.response.status === 401) {
                    history.push('/login')
                }
            })
            .finally(
                setLoading(false)
            )
            // eslint-disable-next-line 
    }, [])

    useEffect(() => {
        getUser()
        // eslint-disable-next-line 
    }, [])

    if(loading) {
        return <div>loading...</div>
    }


    return (
        <div>
            <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
                fill
                >
                    <Tab eventKey="profile" title="Profile">
                        <AccountDetails />
                    </Tab>
                    <Tab eventKey="roles" title="Roles">
                        <RolesTab />
                    </Tab>
                    <Tab eventKey="events" title="Events">
                        <UserEventsTab user_id={userProfile.id} />
                    </Tab>
                    {
                        (account_type !== 'basic' && account_type !== 'creator') &&
                            <Tab eventKey="manager" title="Manager">
                                <BusinessList />
                            </Tab>
                    }
            </Tabs>
            <CreateBusinessButton />
        </div>
    )
}

export default withRouter(Profile);