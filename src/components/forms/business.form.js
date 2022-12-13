import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Col, FloatingLabel, Form, Image, Row } from 'react-bootstrap';

import { image_link } from '../../helpers/dataCleanUp';
import { useUpdateBusinessMutation } from '../../hooks/useBusinessApi';
import useNotification from '../../hooks/useNotification';

const BusinessForm = ({ business }) => {
    const { mutateAsync: updateBusiness } = useUpdateBusinessMutation()
    const { dispatch } = useNotification()

    let navigate = useNavigate()

    const { register, handleSubmit, clearErrors, formState: { isDirty, dirtyFields, errors } } = useForm({
        defaultValues: {
            business_email: business.business_email,
            business_description: business.business_description,
            business_instagram: business?.business_instagram,
            business_website: business?.business_website,
            business_facebook: business?.business_facebook,
            business_phone: business?.business_phone,
            business_twitter: business?.business_twitter,
        }
    })

    const sendBusinessUpdate = async (data) => {
        try {
            const formData = new FormData()

            // remove entries that are unchanged
            for (const [key] of Object.entries(data)) {
                if(!Object.keys(dirtyFields).includes(key)) {
                    delete data[key]
                }
            }

            //! may need to change empty string to null
            // if(data[key] === '') {
            //     data[key] = null
            // }
            Object.key(data).forEach(key => {
                if (key === 'business_avatar') {
                    formData.set('business_avatar', data['business_avatar'][0])
                } else {
                    formData.append(key, data[key])
                }
            })

            const updated_business_response = await updateBusiness({ business_updates: formData, business_id: business.id })

            if (updated_business_response.status === 201) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${updated_business_response.data.business_name} has been updated`
    
                    }
                })
            }

        } catch (error) {
            console.log(error)
        }

    }


    return (
        <>
            <h1>{business?.business_name}</h1>
            <Form onSubmit={handleSubmit(sendBusinessUpdate)}>

                <Form.Group controlId='business_email'>
                    <FloatingLabel controlId='business_email' label='Email' className='mb-2'>
                        <Form.Control
                            className={errors.business_email ? 'inputError' : ''}
                            {...register('business_email')}
                            onFocus={() => clearErrors('business_email')}
                            type='text'
                            name='business_email'
                        />
                    </FloatingLabel>
                    <div className='errormessage'>{errors.business_email?.message}</div>
                </Form.Group>

                <div className='d-flex justify-content-center mb-2'>
                    <Image
                        src={image_link(business.business_avatar)}
                        alt={business.business_name}
                        thumbnail
                    />
                </div>

                {/* <Form.Group controlId='business_avatar'> */}
                <Form.Group controlId='business_avatar' className='mb-2'>
                    <Form.Control
                        className={errors.business_avatar ? 'inputError' : ''}
                        {...register('business_avatar')}
                        onFocus={() => clearErrors('business_avatar')}
                        type='file'
                        name='business_avatar'
                        accept='image/*'
                    />
                    <div className='errormessage'>{errors.business_avatar?.message}</div>
                </Form.Group>

                {/* business description input */}
                <Form.Group controlId='business_description'>
                    <FloatingLabel controlId='business_description' label='Description' className='mb-2'>
                        <Form.Control
                            className={errors.business_description ? 'inputError' : ''}
                            {...register('business_description')}
                            onFocus={() => clearErrors('business_description')}
                            as='textarea'
                            name='business_description'
                            style={{ height: '200px' }}
                        />
                    </FloatingLabel>
                    <div className='errormessage'>{errors.business_description?.message}</div>
                </Form.Group>

                {/* instagram input */}
                <Form.Group controlId='business_instagram'>
                    <FloatingLabel controlId='business_instagram' label='Instagram' className='mb-2'>
                        <Form.Control
                            className={errors.business_instagram ? 'inputError' : ''}
                            {...register('business_instagram')}
                            onFocus={() => clearErrors('business_instagram')}
                            type='text'
                            name='business_instagram'
                        />
                    </FloatingLabel>
                    <div className='errormessage'>{errors.business_instagram?.message}</div>
                </Form.Group>

                {/* website input */}
                <Form.Group controlId='business_website'>
                    <FloatingLabel controlId='business_website' label='Website' className='mb-2'>
                        <Form.Control
                            className={errors.business_website ? 'inputError' : ''}
                            {...register('business_website')}
                            onFocus={() => clearErrors('business_website')}
                            type='text'
                            name='business_website'
                        />
                    </FloatingLabel>
                    <div className='errormessage'>{errors.business_website?.message}</div>
                </Form.Group>

                {/* facebook input */}
                <Form.Group controlId='business_facebook'>
                    <FloatingLabel controlId='business_facebook' label='Facebook' className='mb-2'>
                        <Form.Control
                            className={errors.business_facebook ? 'inputError' : ''}
                            {...register('business_facebook')}
                            onFocus={() => clearErrors('business_facebook')}
                            type='text'
                            name='business_facebook'
                        />
                    </FloatingLabel>
                    <div className='errormessage'>{errors.business_facebook?.message}</div>
                </Form.Group>

                {/* phone input */}
                <Form.Group controlId='business_phone'>
                    <FloatingLabel controlId='business_phone' label='Phone' className='mb-2'>
                        <Form.Control
                            className={errors.business_phone ? 'inputError' : ''}
                            {...register('business_phone')}
                            onFocus={() => clearErrors('business_phone')}
                            type='text'
                            name='business_phone'
                        />
                    </FloatingLabel>
                    <div className='errormessage'>{errors.business_phone?.message}</div>
                </Form.Group>

                {/* twitter input */}
                <Form.Group controlId='business_twitter'>
                    <FloatingLabel controlId='business_twitter' label='Twitter' className='mb-2'>
                        <Form.Control
                            className={errors.business_twitter ? 'inputError' : ''}
                            {...register('business_twitter')}
                            onFocus={() => clearErrors('business_twitter')}
                            type='text'
                            name='business_twitter'
                        />
                    </FloatingLabel>
                    <div className='errormessage'>{errors.business_twitter?.message}</div>
                </Form.Group>

                <Row className='d-flex justify-content-around pt-3'>
                    <Col xs={2}>
                        <Button type='submit' disabled={!isDirty}>Update</Button>
                    </Col>
                    <Col xs={2}>
                        <Button onClick={() => navigate(`/business/${business.id}`)} variant='secondary'>Close</Button>
                    </Col>
                </Row>

            </Form>
        </>
    )
}

export default BusinessForm;