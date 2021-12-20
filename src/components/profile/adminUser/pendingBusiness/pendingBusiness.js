import React, { useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import AxiosInstance from '../../../../helpers/axios';

import { UserAdminContext } from '../../../../context/adminuser/adminuser.provider';

const PendingBusiness = (props) => {
    const { pendingBusinessRequest, setPendingBusinessRequestList } = useContext(UserAdminContext)

    useEffect(() => {
        AxiosInstance.get('/business/pending-approval')
            .then(businesses => {
                setPendingBusinessRequestList(businesses.data)
            })
        // eslint-disable-next-line
    }, []);

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
                    <form className='requestTable'>
                        {
                            pendingBusinessRequest.map(request => (
                                <div className='requestTableRow' key={request.id}>
                                    <p className='requestTableText'>{request.name}</p>
                                    <p className='requestTableText'>{request.businesstype}</p>
                                    <p className='requestTableText'>{request.username}</p>
                                    <div className='requestTableButtons'>
                                        <input type='radio' id='approved' value='approved' />
                                        <input type='radio' id='rejected' value='rejected' />
                                        {/* <input {...register(`${request.id}`)} type='radio' id='approved' value='approved' />
                                        <input {...register(`${request.id}`)} type='radio' id='rejected' value='rejected' /> */}
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