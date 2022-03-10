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

    const approveUser = (e) => {
        const reqData = { request_id: e.currentTarget.value}
        const token = localStorage.getItem('token')

        AxiosInstance.post('/roles/approve-request', reqData, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                const updated = pendingRequest.filter(pr => pr.id !== reqData.request_id)
                setPendingRequest(updated)
                console.log(response)
            })
            .catch(err => console.log(err))
        console.log(e.currentTarget.value)
    }

    // data input shape { role.id: 'approved', role.id: 'rejected', role.id: null }
    const updateRoleRequest = (data) => {
        // remove null values
        data = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null))

        const token = localStorage.getItem('token');
        
        AxiosInstance.post('/roles/update-request', data, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(response => {
                setPendingRequest(response.data)
            })
            .catch(err => console.log(err))

        return
    }

    useEffect(() => {
        getPendingRequest()
        
        return () => {
            setPendingRequest(null)
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
                        <td><Button variant='success' onClick={(e) => approveUser(e)} value={pr.id}>yes</Button></td>
                            <td><Button variant='danger'>no</Button></td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
    )
}

export default PendingRequest;