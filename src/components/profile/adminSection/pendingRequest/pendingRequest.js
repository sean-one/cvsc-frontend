// import React, { useState, useEffect, useContext } from 'react';
import React, { useEffect, useContext, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import AxiosInstance from '../../../../helpers/axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';

import { UsersContext } from '../../../../context/users/users.provider';

const PendingRequest = (props) => {
    const { pendingRequestList, setPendingRequestList } = useContext(UsersContext);
    const { register, handleSubmit } = useForm()

    const getPendingList = useCallback(() => {
        const token = localStorage.getItem('token');
        AxiosInstance.get('/roles/pending-request', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                setPendingRequestList(response.data)
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        getPendingList()
        // eslint-disable-next-line
    }, [])
    
    const sendRequestStatus = (data) => {

        const token = localStorage.getItem('token');
        
        AxiosInstance.post('/roles/update-request', data, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(response => {
                setPendingRequestList(response.data)
                // console.log(response)
            })
            .catch(err => console.log(err))

        return
    }

    return (
        <div>
            <div className='tabHeader'>
                <p>Pending Request</p>
                {/* <FontAwesomeIcon className='tabIcon' icon={faCaretDown} size='1x' /> */}
                {
                    (props.viewable) ?
                        <FontAwesomeIcon className='tabIcon' icon={faCaretDown} size='1x' onClick={props.toggleView} />
                        : <FontAwesomeIcon className='tabIcon' icon={faCaretLeft} size='1x' onClick={props.toggleView} />
                }
            </div>
            {
                (props.viewable) &&
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
                                    <p className='requestTableText'>{request.role_type}</p>
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
            }
        </div>
    )
}

export default PendingRequest;