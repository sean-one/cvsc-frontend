import React, { useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import AxiosInstance from '../../../../helpers/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';

import { UsersContext } from '../../../../context/users/users.provider';

import { roleRequestStatusUpdate } from '../../../../helpers/dataCleanUp';

const PendingRequest = (props) => {
    const { pendingRequestList } = useContext(UsersContext);
    const { register, handleSubmit, reset } = useForm()

    useEffect(() => {

        props.getPending()
        // eslint-disable-next-line
    }, [])
    
    const sendRequestStatus = (data) => {

        const token = localStorage.getItem('token');
        
        const dataClean = roleRequestStatusUpdate(data, pendingRequestList)
        
        AxiosInstance.post('/roles/editUserRoles', dataClean, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(response => {
                props.getPending()
                props.getRoles()
                // reset the form so that nothing is checked already
                reset()
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
            }
        </div>
    )
}

export default PendingRequest;