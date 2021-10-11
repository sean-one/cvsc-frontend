import React, { useEffect, useContext, useCallback } from 'react';
import AxiosInstance from '../../../../helpers/axios';

import { UsersContext } from '../../../../context/users/users.provider';

const PendingRequest = (props) => {
    const { pendingRequestList, setPendingRequestList, useAdminRoles } = useContext(UsersContext);
    const adminRoles = useAdminRoles()

    const getPendingList = useCallback(() => {
        AxiosInstance.post('/pendingRequest/businesses', adminRoles)
            .then(response => {
                setPendingRequestList(response.data)
                // console.log(response.data)
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        getPendingList()
        // esline-disable-next-line
    }, [getPendingList])
    
    return (
        <div>
            <p>here are the pending request</p>
            {
                pendingRequestList.map(request => (
                    <div key={request.id}>
                        <p>{`${request.username} requesting ${request.request_for} access for ${request.name}`}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default PendingRequest;