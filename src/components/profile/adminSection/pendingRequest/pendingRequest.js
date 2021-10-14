import React, { useEffect, useContext, useCallback } from 'react';
import AxiosInstance from '../../../../helpers/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'

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
            <p>Pending Request</p>
            <div className='pendingRequestTable'>
                <div className='tableHeader'>
                    <p className='tableHeadText'>Username</p>
                    <p className='tableHeadText'>Business</p>
                    <p className='tableHeadText'>Rights</p>
                    <FontAwesomeIcon id='requestTableApprove' className='requestTableIcons' icon={faCheck} size='1x' />
                    <FontAwesomeIcon id='requestTableReject' className='requestTableIcons' icon={faTimes} size='1x' />

                </div>
                <div className='requestTable'>
                    {
                        pendingRequestList.map(request => (
                            <div className='requestTableRow' key={request.id}>
                                <p className='requestTableText'>{request.username}</p>
                                <p className='requestTableText'>{request.name}</p>
                                <p className='requestTableText'>{request.request_for}</p>
                                <input type='radio' id='approved' name={request.id} />
                                <input type='radio' id='rejected' name={request.id} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default PendingRequest;