import React, { useContext } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Form, Row } from 'react-bootstrap';

import { requestBusinessCreator } from '../../../helpers/validationSchemas';
import AxiosInstance from '../../../helpers/axios';
import { NotificationsContext } from '../../../context/notifications/notifications.provider';
import { UsersContext } from '../../../context/users/users.provider';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';


const CreatorRequest = () => {
    const { dispatch } = useContext(NotificationsContext);
    const { data: businessList, isLoading } = useBusinessesQuery()
    const { userSignOut, addUserRole, userRolesBusinessIds } = useContext(UsersContext)
    const user_roles_business_ids = userRolesBusinessIds()
    let history = useHistory();
    
    const { register, handleSubmit, reset, clearErrors, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(requestBusinessCreator)
    });
    
    if(isLoading) {
        return <div>loading...</div>
    }
    
    const request_open = businessList.data.filter(business => business.business_request_open)
    const business_filtered = request_open.filter(business => !user_roles_business_ids.includes(business.id))

    const sendRequest = (data) => {
        const token = localStorage.getItem('token')

        AxiosInstance.post('/roles/create-request', data, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                addUserRole(response.data[0])
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `your request has been submitted`
                    }
                })
            })
            .catch(err => {
                if (err.response.data.error.type !== 'token') {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'error',
                            message: err.response.data.error.message
                        }
                    })
                } else {
                    
                    //token error, forward to login screen
                    history.push('/login');

                    // clear localstorage and sign out user info
                    localStorage.clear()
                    userSignOut()

                }
            })
            .finally(() => {
                reset()
            })
    }


    return (
        <Form onSubmit={handleSubmit(sendRequest)}>
            <Row className='d-flex align-items-center px-3'>
                <Col xs={10} className='px-0'>
                    <Form.Label>Business Creator Request</Form.Label>
                    <Form.Group controlId='business_id'>
                        <Form.Select
                            className={errors.business_id ? 'inputError' : ''}
                            onFocus={() => clearErrors('business_id')}
                            {...register('business_id')}
                            required
                        >
                            <option>Business Select...</option>
                            {
                                business_filtered.map(business => (
                                    <option key={business.id} value={business.id}>{business.business_name}</option>
                                    ))
                                }
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col xs={2} className='align-self-end'>
                    <Button type='submit'> + </Button>
                </Col>
            </Row>
            <Row className='errormessage px-3'>
                {errors.business_id?.message}
            </Row>
        </Form>
    )
}

export default withRouter(CreatorRequest);