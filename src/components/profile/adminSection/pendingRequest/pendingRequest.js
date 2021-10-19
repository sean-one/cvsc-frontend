import React, { useEffect, useContext, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import AxiosInstance from '../../../../helpers/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

import { UsersContext } from '../../../../context/users/users.provider';

import { requestSubmit } from '../../../../helpers/requestSubmit';

const PendingRequest = (props) => {
    const { pendingRequestList, setPendingRequestList, useAdminRoles } = useContext(UsersContext);
    const adminRoles = useAdminRoles()
    const { register, handleSubmit } = useForm()

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
    
    const sendRequestStatus = (data) => {
        const dataClean = requestSubmit(data, pendingRequestList)
        console.log(dataClean)
        AxiosInstance.post('/roles/editUserRoles', dataClean)
            .then(response => {
                console.log(response)
            })
            .catch(err => console.log(err))
        return
    }

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
                <form className='requestTable' onSubmit={handleSubmit(sendRequestStatus)}>
                    {
                        pendingRequestList.map(request => (
                            <div className='requestTableRow' key={request.id}>
                                <p className='requestTableText'>{request.username}</p>
                                <p className='requestTableText'>{request.name}</p>
                                <p className='requestTableText'>{request.request_for}</p>
                                <div className='requestTableButtons'>
                                    <input {...register(`${request.id}`)} type='radio' id='approved' value='approved' />
                                    <input {...register(`${request.id}`)} type='radio' id='rejected' value='rejected' />
                                </div>
                            </div>
                        ))
                    }
                    <input type='submit' value='submit' />
                </form>
            </div>
        </div>
    )
}

export default PendingRequest;