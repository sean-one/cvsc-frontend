import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faBan } from '@fortawesome/free-solid-svg-icons';

import useAuth from '../../../hooks/useAuth';
import { useRemoveUserRoleMutation } from '../../../hooks/useRolesApi';
import useNotification from '../../../hooks/useNotification';

const RemoveUserRole = ({ role_id, role_type }) => {
    const { logout_user } = useAuth()
    const { mutateAsync: removeUserRole } = useRemoveUserRoleMutation()
    const { dispatch } = useNotification()
    
    // let navigate = useNavigate()

    const userRoleRemove = async (e) => {
        console.log(e)
        // try {
        //     const removed_role = await removeUserRole(e.currentTarget.value)

        //     if(removed_role.status === 204) {
        //         dispatch({
        //             type: "ADD_NOTIFICATION",
        //             payload: {
        //                 notification_type: 'SUCCESS',
        //                 message: 'role has been deleted'
        //             }
        //         })
                
        //     }


            
        // } catch (error) {
            
        //     if(error?.response.status === 400) {
        //         dispatch({
        //             type: "ADD_NOTIFICATION",
        //             payload: {
        //                 notification_type: 'ERROR',
        //                 message: `${error?.response.data.error.message}`
        //             }
        //         })
        //     }

        //     if(error?.response.status === 401) {
        //         dispatch({
        //             type: "ADD_NOTIFICATION",
        //             payload: {
        //                 notification_type: 'ERROR',
        //                 message: `${error?.response.data.error.message}`
        //             }
        //         })

        //         logout_user()
        //         // navigate('/login')
        //     }
        // }
    }


    return (
        <div className='border border-danger'>
            {
                (role_type === process.env.REACT_APP_ADMIN_ACCOUNT)
                    ? <FontAwesomeIcon icon={faBan} />
                    : <FontAwesomeIcon icon={faTrash} onClick={(e) => userRoleRemove(e)} id={role_id} />
            }
        </div>
        // <Button disabled={role_type === process.env.REACT_APP_ADMIN_ACCOUNT ? true : false} size='sm' onClick={(e) => userRoleRemove(e)} value={role_id}>
        // </Button>
    )
}

export default RemoveUserRole;