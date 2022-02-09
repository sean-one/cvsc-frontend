import React from 'react';
// import React, { useCallback, useEffect, useContext } from 'react';

import { withViewToggle } from '../../../hoc/withViewToggle';
import PendingRequest from './pendingRequest';

// import AxiosInstance from '../../../helpers/axios';

// import { RolesContext } from '../../../context/roles/roles.provider';

import './businessAdminSection.css';


const BusinessAdminSection = (props) => {
    // const { setAllBusinessRoles } = useContext(RolesContext);
    const PendingRequestTab = withViewToggle(PendingRequest)

    // const getBusinessRoles = useCallback(() => {
    //     const token = localStorage.getItem('token')
    //     AxiosInstance.get('/roles/business-admin', {
    //         headers: { 'Authorization': 'Bearer ' + token }
    //     })
    //         .then(response => {
    //             setAllBusinessRoles(response.data)
    //         })
    //         .catch(err => {
    //             console.log('error inside AdminSection')
    //         })
    // }, [setAllBusinessRoles])

    // useEffect(() => {
    //     getBusinessRoles()
    //     //eslint-disable-next-line
    // }, [])

    return (
        <div className='businessAdminSection'>
            <div className='sectionHeader'>
                <h3>Admin Options</h3>
            </div>
            <div className='sectionTabs'>
                <PendingRequestTab />
            </div>
        </div>
    )

}

export default BusinessAdminSection;