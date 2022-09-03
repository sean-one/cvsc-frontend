import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, Form, Row } from 'react-bootstrap';
import styled from 'styled-components';

import { useUpdateBusinessMutation } from '../../../hooks/useBusinessApi';
import { UsersContext } from '../../../context/users/users.provider';
import { NotificationsContext } from '../../../context/notifications/notifications.provider';

const Styles = styled.div`
    .errormessage {
        width: 100%;
        text-align: left;
        padding: 0.25rem;
        color: #DAD7CD;
        /* font-weight: bold; */
    }

    .inputError {
        border: 2px solid red;
    }
`

const EditBusiness = ({ business, handleClose }) => {
    const { id: business_id } = business
    const { mutateAsync: updateBusiness } = useUpdateBusinessMutation()
    const { getBusinessRole } = useContext(UsersContext)
    const { dispatch } = useContext(NotificationsContext)
    const user_role = getBusinessRole(business_id)
    
    const { register, handleSubmit, clearErrors, formState: { isDirty, dirtyFields, errors } } = useForm({
        defaultValues: {
            business_email: business.business_email,
            business_description: business.business_description,
            business_instagram: business.business_instagram,
            business_website: business.business_website,
            business_facebook: business.business_facebook,
            business_phone: business.business_phone,
            business_twitter: business.business_twitter,
        }
    })

    const sendBusinessUpdate = async (data) => {
        // clean up data prior to sending to server
        const dirtyList = Object.keys(dirtyFields)
        for (const [key] of Object.entries(data)) {
            
            // remove if untouched
            if(!dirtyList.includes(key)) {
                delete data[key]
            }

            // change empty string to null
            if(data[key] === '') {
                data[key] = null
            }

        }

        const updated_business_response = await updateBusiness({ ...data, business_id })
        
        if (updated_business_response.status === 201) {
            handleClose()
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${updated_business_response.data.business_name} has been updated`

                }
            })
        } else {
            console.log(updated_business_response)
        }
    }

    return (
        <Styles>
            <Form onSubmit={handleSubmit(sendBusinessUpdate)}>

                {
                    (user_role.role_type === 'admin') &&
                        <Form.Group controlId='business_email'>
                            <Form.Label>Business Email</Form.Label>
                            <Form.Control
                                className={errors.business_email ? 'inputError' : ''}
                                {...register('business_email')}
                                onFocus={() => clearErrors('business_email')}
                                type='text'
                                name='business_email'
                            />
                            <div className='errormessage'>{errors.business_email?.message}</div>
                        </Form.Group>
                }

                {/* <Form.Group controlId='business_avatar'> */}
                {/* <Form.Group>
                    <Form.Label>Business Branding</Form.Label>
                    <Form.Control
                        className={errors.business_avatar ? 'inputError' : ''}
                        {...register('business_avatar')}
                        onFocus={() => clearErrors('business_avatar')}
                        type='text'
                        name='business_avatar'
                    />
                    <div className='errormessage'>{errors.business_avatar?.message}</div>
                </Form.Group> */}

                {/* business description input */}
                <Form.Group controlId='business_description'>
                    <Form.Label>Business Description</Form.Label>
                    <Form.Control
                        className={errors.business_description ? 'inputError' : ''}
                        {...register('business_description')}
                        onFocus={() => clearErrors('business_description')}
                        as='textarea'
                        rows={5}
                        name='business_description'
                    />
                    <div className='errormessage'>{errors.business_description?.message}</div>
                </Form.Group>

                {/* instagram input */}
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

                {/* website input */}
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

                {/* facebook input */}
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

                {/* phone input */}
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

                {/* twitter input */}
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

                <Row className='d-flex justify-content-around pt-3'>
                    <Col xs={2}>
                        <Button type='submit' disabled={!isDirty}>Update</Button>
                    </Col>
                    <Col xs={2}>
                        <Button onClick={handleClose} variant='secondary'>Close</Button>
                    </Col>
                </Row>

            </Form>
        </Styles>
    )
}

export default EditBusiness;