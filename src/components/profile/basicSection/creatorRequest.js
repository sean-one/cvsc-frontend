import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Form, Row } from 'react-bootstrap';

import { requestBusinessCreator } from '../../../helpers/validationSchemas';
import AxiosInstance from '../../../helpers/axios';
import { NotificationsContext } from '../../../context/notifications/notifications.provider';
import { UsersContext } from '../../../context/users/users.provider';
import useBusinessFilter from '../../../hooks/useBusinessFilter';


const CreatorRequest = () => {
    const { dispatch } = useContext(NotificationsContext);
    const { userSignOut } = useContext(UsersContext)
    const { business_filtered } = useBusinessFilter()
    
    const { register, handleSubmit, reset, clearErrors, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(requestBusinessCreator)
    });
    let history = useHistory();

    const sendRequest = (data) => {
        const token = localStorage.getItem('token')

        AxiosInstance.post('/roles/create-request', data, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `your request has been submitted`
                    }
                })
            })
            .catch(err => {
                if (err.response.data.error.type === 'token') {
                    // clear localstorage and sign out user info
                    localStorage.clear()
                    userSignOut()

                    //token error, forward to login screen
                    history.push('/login');
                    
                }

                if(err.response.data.error.type === 'duplicate') {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'error',
                            message: 'a previous request for this business is still pending'
                        }
                    })
                }

                if(err.response.data.error.type === 'missing_input') {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'error',
                            message: 'please be sure to select the business you would like creator rights for'
                        }
                    })
                }
            })
            .finally(() => {
                reset()
            })
    }

    return (
        <Form onSubmit={handleSubmit(sendRequest)}>
            <Row className='d-flex align-items-center'>
                <Col sm={12} lg={8}>
                    <Form.Group controlId='business_id' className='d-flex justify-content-start alight-items-lg-center'>
                        <Form.Select
                            className={errors.business_id ? 'inputError' : ''}
                            onFocus={() => clearErrors('business_id')}
                            {...register('business_id')}
                            required
                        >
                            <option>Business Select...</option>
                            {
                                business_filtered.map(business => (
                                    <option key={business.id} value={business.id}>{business.name}</option>
                                    ))
                                }
                        </Form.Select>
                    </Form.Group>
                    <div className='errormessage'>{errors.business_id?.message}</div>
                </Col>
            </Row>
            <Row className='m-2'>
                <Col lg={4}>
                    <Button type='submit'>Submit</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default CreatorRequest;