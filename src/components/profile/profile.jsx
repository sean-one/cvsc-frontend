import React, { useCallback, useContext, useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';
import { UsersContext } from '../../context/users/users.provider';
import AccountDetails from './accountTab/accountDetails';
// import BusinessList from './managerTab/businessList';
import RolesTab from './rolesTab/rolesTab';
// import UserEventsTab from './userEventsTab/userEventsTab';
import CreateBusinessButton from '../business/buttons/createBusinessButton';


const Profile = () => {
    const { userProfile, userRoles, setProfile } = useContext(UsersContext);
    const [ loading, setLoading ] = useState(false);
    
    let history = useHistory()

    const getUser = useCallback(() => {
        setLoading(true);

        AxiosInstance.get('/auth/user_profile')
            .then(response => {
                console.log(response)
                setProfile(response.data)
            })
            .catch(err => {
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
            <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3"
                fill
                >
                    <Tab eventKey="profile" title="Profile">
                        <AccountDetails />
                    </Tab>
                    {/* <Tab eventKey="roles" title="Roles">
                        <RolesTab user_id={userProfile.id} />
                    </Tab> */}
                    <Tab eventKey="events" title="Events">
                        USER EVENTS
                        {/* <UserEventsTab user_id={props.location.state} /> */}
                    </Tab>
                    {
                        (userProfile.account_type !== 'basic' && userProfile.account_type !== 'creator') &&
                            <Tab eventKey="manager" title="Manager">
                                MANAGER
                                {/* <BusinessList /> */}
                            </Tab>
                    }
            </Tabs>
            <CreateBusinessButton />
        </div>
    )
}

export default withRouter(Profile);