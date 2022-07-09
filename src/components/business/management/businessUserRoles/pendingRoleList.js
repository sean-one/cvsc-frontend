import React, { useContext } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { Button, Col, ListGroup } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons'

import { approveBusinessRole, removeBusinessRole } from '../../../../hooks/useBusinessApi'
import { NotificationsContext } from '../../../../context/notifications/notifications.provider'

const PendingRoleList = ({ pending_roles }) => {
    const queryClient = useQueryClient()
    const { dispatch } = useContext(NotificationsContext)
    let history = useHistory()

    const { mutateAsync: approvalMutation } = useMutation(approveBusinessRole, {
        onSuccess: (request_id) => {
            queryClient.invalidateQueries('business_roles')
        },
        onError: (error, new_business, context) => {
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries('business_roles'),
    })

    const { mutateAsync: removeMutation } = useMutation(removeBusinessRole, {
        onSuccess: (request_id) => {
            queryClient.invalidateQueries('business_roles')
        },
        onError: (error, new_business, context) => {
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries('business_roles'),
    })
    
    const approveRequest = async (e) => {
        const approval_response = await approvalMutation(e.currentTarget.value)

        if(approval_response.status === 200) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${approval_response.data.username} now has ${approval_response.data.role_type} privileges`
                }
            })

        } else if(approval_response.status === 401) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: 'token authorization error, please sign in'
                }
            })
            history.push('/login')

        } else {
            console.log(approval_response)
        }
    }

    const rejectRequest = async (e) => {
        const removal_response = await removeMutation(e.currentTarget.value)

        if(removal_response.status === 200) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: 'request has been rejected'
                }
            })

        } else {
            console.log('something went wrong')
        }
    }

    return (
        <ListGroup variant='flush'>
            {
                pending_roles.map(role => 
                    <ListGroup.Item key={role.id} className='d-flex'>
                        <Col sm={10}>{role.username}</Col>
                        <Col sm={1}>
                            <Button size='sm' variant='success' onClick={(e) => approveRequest(e)} value={role.id}>
                                <FontAwesomeIcon icon={faCheck}/>
                            </Button>
                        </Col>
                        <Col sm={1}>
                            <Button size='sm' variant='danger' onClick={(e) => rejectRequest(e)} value={role.id}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </Button>
                        </Col>
                    </ListGroup.Item>
                )
            }
        </ListGroup>
    )
}

export default PendingRoleList