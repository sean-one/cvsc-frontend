import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useHistory, withRouter } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Form, Row } from 'react-bootstrap';

import { requestBusinessCreator } from '../../../helpers/validationSchemas';
import LoadingSpinner from '../../loadingSpinner';
import AxiosInstance from '../../../helpers/axios';
import useNotification from '../../../hooks/useNotification';
import useAuth from '../../../hooks/useAuth';
import { UsersContext } from '../../../context/users/users.provider';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';


const CreatorRequest = () => {
    const { auth, setAuth } = useAuth()
    const businessIdList = auth.roles.map(role => role.business_id)
    
    const { dispatch } = useNotification();
    const { data: businessList, isLoading } = useBusinessesQuery()
    const { userSignOut, addUserRole } = useContext(UsersContext)
    
    let navigate = useNavigate();
    
    const { register, handleSubmit, reset, clearErrors, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(requestBusinessCreator)
    });
    
    if(isLoading) {
        return <LoadingSpinner />
    }

    // filter out businesses that are not currently excepting request
    const request_open = businessList.data.filter(business => business.business_request_open && business.active_business)
    // filter out the businesses that the user already has role rights to
    const business_filtered = request_open.filter(business => !businessIdList.includes(business.id))
    
    const sendRequest = async (data) => {
        if(!data.business_id) return

        const request_response = await AxiosInstance.post(`/roles/request/${data.business_id}`)
        
        // if(request_response.status === 201) {
        //     setAuth({ user: { ...auth.user }, roles: { ...auth.roles, request_response.data }})
        // }
        return

        // AxiosInstance.post('/roles/create-request', data, {
        //     headers: { 'Authorization': 'Bearer ' + token }
        // })
        //     .then(response => {
        //         addUserRole(response.data[0])
        //         dispatch({
        //             type: "ADD_NOTIFICATION",
        //             payload: {
        //                 notification_type: 'SUCCESS',
        //                 message: `your request has been submitted`
        //             }
        //         })
        //     })
        //     .catch(err => {
        //         if (err.response.data.error.type !== 'token') {
        //             dispatch({
        //                 type: "ADD_NOTIFICATION",
        //                 payload: {
        //                     notification_type: 'error',
        //                     message: err.response.data.error.message
        //                 }
        //             })
        //         } else {
                    
        //             //token error, forward to login screen
        //             navigate('/login');

        //             // clear localstorage and sign out user info
        //             localStorage.clear()
        //             userSignOut()

        //         }
        //     })
        //     .finally(() => {
        //         reset()
        //     })
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

export default CreatorRequest;