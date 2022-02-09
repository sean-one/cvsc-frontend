import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

import { RolesContext } from '../../../context/roles/roles.provider';
import AxiosInstance from '../../../helpers/axios';

import TabHeader from '../sectionComponents/tabHeader';

const PendingRequest = (props) => {
    const { usePendingRoles, setAllBusinessRoles } = useContext(RolesContext);
    const [ pendingRequest, setPendingRequest ] = useState(usePendingRoles())
    const { register, handleSubmit } = useForm()

    // data input shape { role.id: 'approved', role.id: 'rejected', role.id: null }
    const updateRoleRequest = (data) => {
        // remove null values
        data = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null))

        const token = localStorage.getItem('token');
        
        AxiosInstance.post('/roles/update-request', data, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(response => {
                setAllBusinessRoles(pendingRequest)
                // setAllBusinessRoles(response.data)
            })
            .catch(err => console.log(err))

        return
    }


    return (
        <div>
            <TabHeader title='Pending Requests' viewable={props.viewable} toggleView={props.toggleView} />
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
                    <form className='requestTable' onSubmit={handleSubmit(updateRoleRequest)}>
                        {
                            pendingRequest.map(request => (
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