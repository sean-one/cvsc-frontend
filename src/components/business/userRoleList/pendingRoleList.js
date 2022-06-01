import React, { useContext } from 'react'
import { Button, Col, ListGroup } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons'

import AxiosInstance from '../../../helpers/axios'
import { NotificationsContext } from '../../../context/notifications/notifications.provider'

const PendingRoleList = ({ pending_roles }) => {
    const { dispatch } = useContext(NotificationsContext)
    let history = useHistory()
    
    const approveRequest = (e) => {
        const request_data = { request_id: e.currentTarget.value }
        const token = localStorage.getItem('token')

        AxiosInstance.post(`/roles/approve/${request_data.request_id}`, request_data, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'request has been approved'
                    }
                })
            })
            .catch(err => {
                if (err.response.status === 401) {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: 'token authorization error, please sign in'
                        }
                    })
                    history.push('/login')
                } else {
                    console.log(err.response)
                }
            })
    }

    const rejectRequest = (e) => {
        const request_id = e.currentTarget.value
        const token = localStorage.getItem('token')

        AxiosInstance.delete(`/roles/reject-request/${request_id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'request has been rejected'
                    }
                })
            })
            .catch(err => console.log(err))
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