import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Button, Table, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';

import AxiosInstance from '../../../helpers/axios';
import { NotificationsContext } from '../../../context/notifications/notifications.provider';

const PendingRequest = (props) => {
    const [ pendingRequest, setPendingRequest ] = useState([])
    const { dispatch } = useContext(NotificationsContext)
    let history = useHistory()

    const getPendingRequest = useCallback(() => {
        const token = localStorage.getItem('token')

        AxiosInstance.get('/roles/pending-request', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                setPendingRequest(response.data)
            })
            .catch(err => {
                console.log('error inside pending request')
            })
    }, [setPendingRequest])

    const approveRequest = (e) => {
        const request_data = { request_id: e.currentTarget.value }
        const token = localStorage.getItem('token')

        AxiosInstance.post(`/roles/approve/${request_data.request_id}`, request_data, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                const updated = pendingRequest.filter(pr => pr.id !== response.data[0].id)
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'request has been approved'
                    }
                })
                setPendingRequest(updated)
            })
            .catch(err => {
                if(err.response.status === 401) {
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

        console.log(pendingRequest)
        AxiosInstance.delete(`/roles/reject-request/${request_id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                console.log(response)
                const updated = pendingRequest.filter(pr => pr.id !== request_id)
                console.log(updated)
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'request has been rejected'
                    }
                })
                setPendingRequest(updated)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getPendingRequest()
        
        return () => {
            setPendingRequest([])
        }
        //eslint-disable-next-line
    }, [])

    return (
        <Row>
            <Table striped hover>
                <thead>
                    <tr>
                    <th>username</th>
                    <th>business</th>
                    <th className='text-end'><FontAwesomeIcon icon={faCheck} /></th>
                    <th className='text-end'><FontAwesomeIcon icon={faTrash} /></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pendingRequest.map(pr => (
                            <tr key={pr.id}>
                            <td>{pr.username}</td>
                            <td>{pr.business_name}</td>
                                <td className='text-end'>
                                    <Button size='sm' variant='success' onClick={(e) => approveRequest(e)} value={pr.id}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </Button>
                                </td>
                                <td className='text-end'>
                                    <Button size='sm' variant='danger' onClick={(e) => rejectRequest(e)} value={pr.id}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </Row>
    )
}

export default PendingRequest;