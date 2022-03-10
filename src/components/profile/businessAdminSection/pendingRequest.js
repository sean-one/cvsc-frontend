import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table } from 'react-bootstrap';

import AxiosInstance from '../../../helpers/axios';

const PendingRequest = (props) => {
    const [ pendingRequest, setPendingRequest ] = useState([])

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
        const reqData = { request_id: e.currentTarget.value}
        const token = localStorage.getItem('token')

        AxiosInstance.post('/roles/approve-request', reqData, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                const updated = pendingRequest.filter(pr => pr.id !== parseInt(reqData.request_id))
                setPendingRequest(updated)
            })
            .catch(err => console.log(err))
    }

    const rejectRequest = (e) => {
        const request_id = e.currentTarget.value
        const token = localStorage.getItem('token')

        AxiosInstance.delete(`/roles/reject-request/${request_id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                const updated = pendingRequest.filter(pr => pr.id !== parseInt(request_id))
                console.log(updated)
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
        <Table striped bordered hover>
            <thead>
                <tr>
                <th>Username</th>
                <th>Business</th>
                <th>Requested</th>
                <th>Approve</th>
                <th>Reject</th>
                </tr>
            </thead>
            <tbody>
                {
                    pendingRequest.map(pr => (
                        <tr key={pr.id}>
                        <td>{pr.username}</td>
                        <td>{pr.name}</td>
                        <td>{pr.role_type}</td>
                            <td><Button variant='success' onClick={(e) => approveRequest(e)} value={pr.id}>yes</Button></td>
                            <td><Button variant='danger' onClick={(e) => rejectRequest(e)} value={pr.id}>no</Button></td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
    )
}

export default PendingRequest;