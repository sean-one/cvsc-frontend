import React, { useContext } from 'react';
// import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons'

import { 
    // usePendingRoleMutation,
    // useUserRoleDeleteMutation,
    // useCreatorUpgradeMutation,
    // useManagerDowngradeMutation,
    useManagerRoleDeleteMutation
} from '../../hooks/useBusinessApi';

import { NotificationsContext } from '../../context/notifications/notifications.provider';
import ApproveRequestButton from './buttons/approveRequestButton';
import DeleteRequestButton from './buttons/deleteRequestButton';
import UpgradeButton from './buttons/upgradeButton';
import DowngradeButton from './buttons/downgradeButton';

const RolesList = ({ roles_list, list_type }) => {
    const { dispatch } = useContext(NotificationsContext)

    // const { mutateAsync: roleApprovalMutation } = usePendingRoleMutation()
    // const { mutateAsync: userDeleteMutation } = useUserRoleDeleteMutation()
    // const { mutateAsync: creatorUpgradeMutation } = useCreatorUpgradeMutation()
    // const { mutateAsync: managerDowngradeMutation } = useManagerDowngradeMutation()
    const { mutateAsync: managerDeleteMutation } = useManagerRoleDeleteMutation()

    // let history = useHistory()

    // approve pending role request
    // const approveRequest = async (e) => {
    //     const approval_response = await roleApprovalMutation(e.currentTarget.value)

    //     if(approval_response.status === 200) {
    //         dispatch({
    //             type: "ADD_NOTIFICATION",
    //             payload: {
    //                 notification_type: 'SUCCESS',
    //                 message: `${approval_response.data.username} now has ${approval_response.data.role_type} privileges`
    //             }
    //         })

    //     } else if(approval_response.status === 401) {
    //         dispatch({
    //             type: "ADD_NOTIFICATION",
    //             payload: {
    //                 notification_type: 'ERROR',
    //                 message: 'token authorization error, please sign in'
    //             }
    //         })
    //         history.push('/login')

    //     } else {
    //         console.log(approval_response)
    //     }
    // }

    // rejects and deletes pending role request & remove creator role
    // const removeRole = async (e) => {
    //     const removal_response = await userDeleteMutation(e.currentTarget.value)

    //     if(removal_response.status === 200) {
    //         dispatch({
    //             type: "ADD_NOTIFICATION",
    //             payload: {
    //                 notification_type: 'SUCCESS',
    //                 message: 'request has been rejected'
    //             }
    //         })

    //     } else {
    //         console.log('something went wrong')
    //     }
    // }

    // upgrades creator account to manager account
    // const upgradeCreator = async (e) => {
    //     const upgrade_response = await creatorUpgradeMutation(e.currentTarget.value)
        
    //     if(upgrade_response.status === 200) {
    //         dispatch({
    //             type: "ADD_NOTIFICATION",
    //             payload: {
    //             notification_type: 'SUCCESS',
    //             message: `${upgrade_response.data.username} now has ${upgrade_response.data.role_type} privileges`
    //             }
    //         })
    //     } else {
    //         dispatch({
    //             type: "ADD_NOTIFICATION",
    //             payload: {
    //                 notification_type: 'ERROR',
    //                 message: 'token authorization error, please sign in'
    //             }
    //         })
    //         history.push('/login')
    //     }
    // }

    // downgrade manager roles
    // const downgradeManagerRole = async (e) => {
    //     const downgrade_response = await managerDowngradeMutation(e.currentTarget.value)

    //     if(downgrade_response.status === 200) {
    //         dispatch({
    //             type: "ADD_NOTIFICATION",
    //             payload: {
    //             notification_type: 'SUCCESS',
    //             message: `${downgrade_response.data.username} has been downgraded to creator privileges`
    //             }
    //         })
    //     } else {
    //         dispatch({
    //             type: "ADD_NOTIFICATION",
    //             payload: {
    //             notification_type: 'ERROR',
    //             message: 'something is not right'
    //             }
    //         })
    //         history.push('/login')
    //     }
    // }

    // remove manager roles
    const removeManagerRole = async (e) => {
        const removed_manager = await managerDeleteMutation(e.currentTarget.value)

        if(removed_manager.status === 200) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                notification_type: 'SUCCESS',
                message: `manager role has been deleted`
                }
            })
        } else {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                notification_type: 'ERROR',
                message: 'error inside manager remove'
                }
            })
        }
    }

    return (
        <div>
          {
              roles_list.map(role =>
                <div key={role.id} className='d-flex justify-content-between px-3 py-2 border-bottom border-dark rounded-bottom'>
                  <div>{role.username}</div>
                  <div className='d-flex'>
                    <div className='text-center me-4'>
                        {
                            (list_type === 'pending') &&
                                <ApproveRequestButton role_id={role.id} />
                                // <Button size='sm' variant='success' onClick={(e) => approveRequest(e)} value={role.id}>
                                //     <FontAwesomeIcon icon={faCheck}/>
                                // </Button>
                        }

                        {
                            (list_type === 'creator') &&
                                <UpgradeButton role_id={role.id} />
                                // <Button size='sm' variant='outline-success' onClick={(e) => upgradeCreator(e)} value={role.id}>upgrade</Button>
                        }

                        {
                            (list_type === 'manager') &&
                                <DowngradeButton role_id={role.id} />
                                // <Button size='sm' variant='outline-danger' onClick={(e) => downgradeManagerRole(e)} value={role.id}>downgrade</Button>
                        }
                    </div>
                    <div className='text-center'>
                        {
                            (list_type === 'pending') &&
                                <DeleteRequestButton role_id={role.id} />
                                // <Button size='sm' variant='danger' onClick={(e) => removeRole(e)} value={role.id}>
                                //     <FontAwesomeIcon icon={faTrash}/>
                                // </Button>
                        }

                        {
                            (list_type === 'creator') &&
                                <DeleteRequestButton role_id={role.id} />
                                // <Button size='sm' variant='danger' onClick={(e) => removeRole(e)} value={role.id}>remove</Button>
                        }

                        {
                            (list_type === 'manager') &&
                                <Button size='sm' variant='danger' onClick={(e) => removeManagerRole(e)} value={role.id}>remove</Button>
                        }
                    </div>
                  </div>
                </div>
            )
          }
        </div>
    )
}

export default RolesList;