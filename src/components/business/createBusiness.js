import React, { useContext } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import { addBusinessSchema } from '../../helpers/validationSchemas';
import { createBusiness } from '../../hooks/useBusinessApi';
import { NotificationsContext } from '../../context/notifications/notifications.provider';
import { UsersContext } from '../../context/users/users.provider';

const CreateBusiness = () => {
    const queryClient = useQueryClient()
    const { addUserRole } = useContext(UsersContext)
    const {dispatch } = useContext(NotificationsContext) 
    
    const { mutateAsync } = useMutation(createBusiness, {
        onSuccess: ({ data: new_business }) => {
            const admin_role = {
                business_id: new_business.id,
                business_name: new_business.business_name,
                active_role: new_business.active_role,
                role_type: new_business.role_type
            }
    
            addUserRole(admin_role)

            // delete business.data['active_role']
            // delete business.data['role_type']
            
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${new_business.business_name} business request submitted`
                }
            })
            
            history.push({
                pathname: `/business/manage/${new_business.id}`,
                state: {
                    business_id: new_business.id,
                }
            });
        },
        onError: (error, new_business, context) => {
            console.log(error)
        },
        onSettled: () => queryClient.refetchQueries("businesses"),
    })
    
    const { register, handleSubmit, watch, reset, setError, clearErrors, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(addBusinessSchema)
    });

    const businessType = watch('business_type', 'brand')
    let history = useHistory();

    const sendRequest = async (business_data) => {
        await mutateAsync(business_data)

        reset()
        
        //     .catch(err => {
                
        //         if (err.response.status) {
        //             setError(`${err.response.data.type}`, {
        //                 type: 'server',
        //                 message: err.response.data.message
        //             })
        //         }
                
        //         dispatch({
        //             type: "ADD_NOTIFICATION",
        //             payload: {
        //                 notification_type: 'ERROR',
        //                 message: `${err.response.data.message}`
        //             }
        //         })
        //     })
    }


    return (
        <Form onSubmit={handleSubmit(sendRequest)}>
            <Form.Group controlId='business_name'>
                <Form.Label>Business Name</Form.Label>
                <Form.Control
                    className={errors.business_name ? 'inputError' : ''}
                    {...register('business_name')}
                    autoFocus
                    onFocus={() => clearErrors('business_name')}
                    type='text'
                    name='business_name'
                    required
                />
                <div className='errormessage'>{errors.business_name?.message}</div>
            </Form.Group>

            <Form.Group controlId='business_email'>
                <Form.Label>Business Email</Form.Label>
                <Form.Control
                    className={errors.business_email ? 'inputError' : ''}
                    {...register('business_email')}
                    onFocus={() => clearErrors('business_email')}
                    type='text'
                    name='business_email'
                    required
                />
                <div className='errormessage'>{errors.business_email?.message}</div>
            </Form.Group>

            {/* <Form.Group controlId='business_avatar'> */}
            <Form.Group>
                <Form.Label>Business Branding</Form.Label>
                <Form.Control
                    className={errors.business_avatar ? 'inputError' : ''}
                    {...register('business_avatar')}
                    onFocus={() => clearErrors('business_avatar')}
                    type='text'
                    name='business_avatar'
                    value='https://picsum.photos/100/100'
                    required
                />
                <div className='errormessage'>{errors.business_avatar?.message}</div>
            </Form.Group>

            <Form.Group controlId='business_description'>
                <Form.Label>Business Bio</Form.Label>
                <Form.Control
                    className={errors.business_description ? 'inputError' : ''}
                    {...register('business_description')}
                    onFocus={() => clearErrors('business_description')}
                    as='textarea'
                    rows={5}
                    name='business_description'
                    required
                />
                <div className='errormessage'>{errors.business_description?.message}</div>
            </Form.Group>

            <Form.Group controlId='business_type'>
                <Form.Label>Business Type</Form.Label>
                <Form.Select
                    className={errors.business_type ? 'inputError' : ''}
                    {...register('business_type')}
                    onFocus={() => clearErrors('business_type')}
                    type='text'
                    name='business_type'
                    required
                >
                    <option value='brand'>Brand</option>
                    <option value='venue'>Dispensary</option>
                    <option value='both'>{`Brand & Dispensary`}</option>
                </Form.Select>
                <div className='errormessage'>{errors.business_type?.message}</div>
            </Form.Group>

            {
                (businessType !== 'brand') && (
                    <Container>
                        <Row>
                            <Col>
                                <Form.Group controlId='street_address'>
                                    <Form.Label>Street Address</Form.Label>
                                    <Form.Control
                                        className={errors.street_address ? 'inputError' : ''}
                                        {...register('street_address')}
                                        onFocus={() => clearErrors('street_address')}
                                        type='text'
                                        name='street_address'
                                        required
                                    />
                                    <div className='errormessage'>{errors.street_address?.message}</div>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId='city'>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        className={errors.city ? 'inputError' : ''}
                                        {...register('city')}
                                        onFocus={() => clearErrors('city')}
                                        type='text'
                                        name='city'
                                        required
                                    />
                                    <div className='errormessage'>{errors.city?.message}</div>
                                </Form.Group>
                            </Col>

                            <Col lg={3}>
                                <Form.Group controlId='state'>
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        className={errors.state ? 'inputError' : ''}
                                        {...register('state')}
                                        onFocus={() => clearErrors('state')}
                                        type='text'
                                        name='state'
                                        required
                                    />
                                    <div className='errormessage'>{errors.state?.message}</div>
                                </Form.Group>
                            </Col>

                            <Col lg={3}>
                                <Form.Group controlId='zip'>
                                    <Form.Label>Zip</Form.Label>
                                    <Form.Control
                                        className={errors.zip ? 'inputError' : ''}
                                        {...register('zip')}
                                        onFocus={() => clearErrors('zip')}
                                        type='text'
                                        name='zip'
                                        required
                                    />
                                    <div className='errormessage'>{errors.zip?.message}</div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>
                )
            }
            
            <Form.Group controlId='business_instagram'>
                <Form.Label>Instagram</Form.Label>
                <Form.Control
                    className={errors.business_instagram ? 'inputError' : ''}
                    {...register('business_instagram')}
                    onFocus={() => clearErrors('business_instagram')}
                    type='text'
                    name='business_instagram'
                />
                <div className='errormessage'>{errors.business_instagram?.message}</div>
            </Form.Group>

            <Form.Group controlId='business_website'>
                <Form.Label>Website</Form.Label>
                <Form.Control
                    className={errors.business_website ? 'inputError' : ''}
                    {...register('business_website')}
                    onFocus={() => clearErrors('business_website')}
                    type='text'
                    name='business_website'
                />
                <div className='errormessage'>{errors.business_website?.message}</div>
            </Form.Group>

            <Form.Group controlId='business_facebook'>
                <Form.Label>Facebook</Form.Label>
                <Form.Control
                    className={errors.business_facebook ? 'inputError' : ''}
                    {...register('business_facebook')}
                    onFocus={() => clearErrors('business_facebook')}
                    type='text'
                    name='business_facebook'
                />
                <div className='errormessage'>{errors.business_facebook?.message}</div>
            </Form.Group>

            <Form.Group controlId='business_phone'>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                    className={errors.business_phone ? 'inputError' : ''}
                    {...register('business_phone')}
                    onFocus={() => clearErrors('business_phone')}
                    type='text'
                    name='business_phone'
                />
                <div className='errormessage'>{errors.business_phone?.message}</div>
            </Form.Group>

            <Form.Group controlId='business_twitter'>
                <Form.Label>Twitter</Form.Label>
                <Form.Control
                    className={errors.business_twitter ? 'inputError' : ''}
                    {...register('business_twitter')}
                    onFocus={() => clearErrors('business_twitter')}
                    type='text'
                    name='business_twitter'
                />
                <div className='errormessage'>{errors.business_twitter?.message}</div>
            </Form.Group>

            <Button type='submit'>Submit</Button>
        </Form>
    )
}

export default withRouter(CreateBusiness);