import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import AxiosInstance from '../../../../helpers/axios';

import { UserAdminContext } from '../../../../context/adminuser/adminuser.provider';

const PendingBusiness = (props) => {
    const [ refresher, setRefresher ] = useState(false)
    const { pendingBusinessRequest, setPendingBusinessRequestList } = useContext(UserAdminContext)
    const { register, handleSubmit, reset } = useForm()

    const updateBusinessRequestStatus = (data) => {
        const businessIds = []
        // remove null keys and value pair where value is null
        let nullRemoved = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null));
        Object.keys(nullRemoved).forEach(k => {
            if (nullRemoved[k] === 'approved') {
                businessIds.push(k)
            }
        })

        AxiosInstance.post('/business/update-approval', businessIds)
            .then(response => {
                reset()
                setRefresher(!refresher)
                // console.log(response)
            })
            .catch(err => console.log(err))
        
        return
    }

    useEffect(() => {
        AxiosInstance.get('/business/pending-approval')
            .then(businesses => {
                setPendingBusinessRequestList(businesses.data)
            })
        // eslint-disable-next-line
    }, [refresher]);

    return (
        <div>
            <div className='tabHeader'>
                <p>Pending Business Request</p>
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
                        <p className='tableHeadText'>Name</p>
                        <p className='tableHeadText'>Type</p>
                        <p className='tableHeadText'>User</p>
                        <FontAwesomeIcon id='requestTableApprove' className='requestTableIcons' icon={faCheck} size='1x' />
                        <FontAwesomeIcon id='requestTableReject' className='requestTableIcons' icon={faTimes} size='1x' />

                    </div>
                    <form className='requestTable' onSubmit={handleSubmit(updateBusinessRequestStatus)}>
                        {
                            pendingBusinessRequest.map(request => (
                                <div className='requestTableRow' key={request.id}>
                                    <p className='requestTableText'>{request.name}</p>
                                    <p className='requestTableText'>{request.businesstype}</p>
                                    <p className='requestTableText'>{request.username}</p>
                                    <div className='requestTableButtons'>
                                        <input {...register(`${request.id}`)} type='radio' id='approved' value='approved' />
                                        <input {...register(`${request.id}`)} type='radio' id='rejected' value='rejected' />
                                        {/* <input type='radio' id='approved' value='approved' /> */}
                                        {/* <input type='radio' id='rejected' value='rejected' /> */}
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

export default PendingBusiness;