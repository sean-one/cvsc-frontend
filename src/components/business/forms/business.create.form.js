import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, FloatingLabel, Form, Row } from 'react-bootstrap';

import useAuth from '../../../hooks/useAuth';
import { createBusinessSchema } from '../../../helpers/validationSchemas';
import { useCreateBusinessMutation } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';


const BusinessCreateForm = () => {
    const { logout_user } = useAuth()
    const { mutateAsync: createBusiness } = useCreateBusinessMutation()
    const { dispatch } = useNotification()

    const { register, handleSubmit, watch, reset, clearErrors, setError, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(createBusinessSchema),
        defaultValues: {
            business_name: null,
            business_email: null,
            business_avatar: '',
            business_description: null,
            business_type: 'brand',
            street_address: '',
            city: '',
            state: '',
            zip: '',
            business_instagram: '',
            business_facebook: '',
            business_website: '',
            business_twitter: ''

        }
    });

    const business_location = watch('business_location', false)
    let navigate = useNavigate();

    const create_business = async (business_data) => {
        try {

            const formData = new FormData()

            Object.keys(business_data).forEach(key => {
                if (key === 'business_avatar') {
                    formData.set(key, business_data[key][0])
                } else {
                    formData.append(key, business_data[key])
                }
            })

            const new_business = await createBusiness(formData)

            if (new_business.status === 201) {

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${new_business.data.business_name} business request submitted`
                    }
                })

                reset()

                navigate(`/business/${new_business.data.id}`)

            }

        } catch (error) {
            console.log(error)
            if (error.response.status === 400) {
                setError(`${error.response.data.error.type}`, {
                    type: 'server',
                    message: error.response.data.error.message
                })

            }

            if (error.response.status === 401) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error.response.data.error.message
                    }
                })

                logout_user()
                // navigate('/login')

            }

        }

    }


    return (
        <Form onSubmit={handleSubmit(create_business)} encType='multipart/form-data'>
            
            <Form.Group controlId='business_name'>
                <FloatingLabel controlId='business_name' label='Business Name' className='mb-2'>
                    <Form.Control
                        className={errors.business_name ? 'inputError' : ''}
                        {...register('business_name')}
                        onFocus={() => clearErrors('business_name')}
                        type='text'
                        name='business_name'
                    />
                </FloatingLabel>
                <div className='errormessage'>{errors.business_name?.message}</div>
            </Form.Group>

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

            <div className='d-flex'>
                <Form.Group controlId='business_type' className='mb-2 flex-fill'>
                    <FloatingLabel controlId='business_type' label='Business Type' className='mb-2'>
                        <Form.Select
                            className={errors.business_type ? 'inputError' : ''}
                            {...register('business_type')}
                            onFocus={() => clearErrors('business_type')}
                            type='text'
                            name='business_type'
                        >
                            <option value='brand'>Brand</option>
                            <option value='venue'>Dispensary</option>
                            <option value='both'>{`Brand & Dispensary`}</option>
                        </Form.Select>
                    </FloatingLabel>
                    <div className='errormessage'>{errors.business_type?.message}</div>
                </Form.Group>

                <Form.Group controlId='business_location' className='ms-2 align-self-center'>
                    <Form.Check
                        className={errors.business_location ? 'inputError' : ''}
                        {...register('business_location')}
                        type='checkbox'
                        label='Add Location'
                    />
                    <div className='errormessage'>{errors.business_location?.message}</div>
                </Form.Group>
            </div>

            {
                (business_location) &&
                <div>
                    {/* street address input for location */}
                    <Form.Group controlId='street_address'>
                        <FloatingLabel controlId='street_address' label='Street Address' className='mb-2'>
                            <Form.Control
                                className={errors.street_address ? 'inputError' : ''}
                                {...register('street_address')}
                                onFocus={() => clearErrors('street_address')}
                                type='text'
                                name='street_address'
                            />
                        </FloatingLabel>
                        <div className='errormessage'>{errors.street_address?.message}</div>
                    </Form.Group>

                    {/* city input for location */}
                    <Form.Group controlId='city'>
                        <FloatingLabel controlId='city' label='City' className='mb-2'>
                            <Form.Control
                                className={errors.city ? 'inputError' : ''}
                                {...register('city')}
                                onFocus={() => clearErrors('city')}
                                type='text'
                                name='city'
                            />
                        </FloatingLabel>
                        <div className='errormessage'>{errors.city?.message}</div>
                    </Form.Group>

                    <div className='d-flex justify-content-between'>
                        {/* state input for location */}
                        <Form.Group controlId='state'>
                            <FloatingLabel controlId='state' label='State' className='me-2 mb-2'>
                                <Form.Control
                                    className={errors.state ? 'inputError' : ''}
                                    {...register('state')}
                                    onFocus={() => clearErrors('state')}
                                    type='text'
                                    name='state'
                                />
                            </FloatingLabel>
                            <div className='errormessage'>{errors.state?.message}</div>
                        </Form.Group>

                        {/* zip code input for location */}
                        <Form.Group controlId='zip'>
                            <FloatingLabel controlId='zip' label='Zip Code' className='mb-2'>
                                <Form.Control
                                    className={errors.zip ? 'inputError' : ''}
                                    {...register('zip')}
                                    onFocus={() => clearErrors('zip')}
                                    type='text'
                                    name='zip'
                                />
                            </FloatingLabel>
                            <div className='errormessage'>{errors.zip?.message}</div>
                        </Form.Group>
                    </div>
                </div>
            }

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
                    <Button type='submit'>Create</Button>
                </Col>
                <Col xs={2}>
                    <Button onClick={() => navigate(-1)} variant='secondary'>Close</Button>
                </Col>
            </Row>

        </Form>
        // <Form onSubmit={handleSubmit(sendRequest)} encType='multipart/form-data' className='gy-3'>
        //     {/* business name input */}
        //     <Form.Group controlId='business_name'>
        //         <Form.Label>Business Name</Form.Label>
        //         <Form.Control
        //             className={errors.business_name ? 'inputError' : ''}
        //             {...register('business_name')}
        //             autoFocus
        //             onFocus={() => clearErrors('business_name')}
        //             type='text'
        //             name='business_name'
        //             required
        //         />
        //         <div className='errormessage'>{errors.business_name?.message}</div>
        //     </Form.Group>

        //     {/* business email input */}
        //     <Form.Group controlId='business_email'>
        //         <Form.Label>Business Email</Form.Label>
        //         <Form.Control
        //             className={errors.business_email ? 'inputError' : ''}
        //             {...register('business_email')}
        //             onFocus={() => clearErrors('business_email')}
        //             type='text'
        //             name='business_email'
        //             required
        //         />
        //         <div className='errormessage'>{errors.business_email?.message}</div>
        //     </Form.Group>

        //     {/* <Form.Group controlId='business_avatar'> */}
        //     <Form.Group controlId='business_avatar'>
        //         <Form.Label>Business Branding</Form.Label>
        //         <Form.Control
        //             className={errors.business_avatar ? 'inputError' : ''}
        //             {...register('business_avatar')}
        //             onFocus={() => clearErrors('business_avatar')}
        //             type='file'
        //             name='business_avatar'
        //             accept='image/*'
        //             onChange={(e) => setImageFile(e.target.files[0])}
        //         />
        //         <div className='errormessage'>{errors.business_avatar?.message}</div>
        //     </Form.Group>

        //     {/* business description input */}
        //     <Form.Group controlId='business_description'>
        //         <Form.Label>Business Description</Form.Label>
        //         <Form.Control
        //             className={errors.business_description ? 'inputError' : ''}
        //             {...register('business_description')}
        //             onFocus={() => clearErrors('business_description')}
        //             as='textarea'
        //             rows={5}
        //             name='business_description'
        //             required
        //         />
        //         <div className='errormessage'>{errors.business_description?.message}</div>
        //     </Form.Group>

        //     {/* business type option selector */}
        //     <Form.Group controlId='business_type'>
        //         <Form.Label>Business Type</Form.Label>
        //         <Form.Select
        //             className={errors.business_type ? 'inputError' : ''}
        //             {...register('business_type')}
        //             onFocus={() => clearErrors('business_type')}
        //             type='text'
        //             name='business_type'
        //             required
        //         >
        //             <option value='brand'>Brand</option>
        //             <option value='venue'>Dispensary</option>
        //             <option value='both'>{`Brand & Dispensary`}</option>
        //         </Form.Select>
        //         <div className='errormessage'>{errors.business_type?.message}</div>
        //     </Form.Group>

        //     {/* if business type is dispensary or both, address option will display */}
        //     {
        //         (businessType !== 'brand') && (
        //             <div>
        //                 <div>
        //                     {/* street address input for location */}
        //                     <Form.Group controlId='street_address'>
        //                         <Form.Label>Street Address</Form.Label>
        //                         <Form.Control
        //                             className={errors.street_address ? 'inputError' : ''}
        //                             {...register('street_address')}
        //                             onFocus={() => clearErrors('street_address')}
        //                             type='text'
        //                             name='street_address'
        //                             required
        //                         />
        //                         <div className='errormessage'>{errors.street_address?.message}</div>
        //                     </Form.Group>
        //                 </div>
        //                 <div>
        //                     {/* city input for location */}
        //                     <Form.Group controlId='city'>
        //                         <Form.Label>City</Form.Label>
        //                         <Form.Control
        //                             className={errors.city ? 'inputError' : ''}
        //                             {...register('city')}
        //                             onFocus={() => clearErrors('city')}
        //                             type='text'
        //                             name='city'
        //                             required
        //                         />
        //                         <div className='errormessage'>{errors.city?.message}</div>
        //                     </Form.Group>
        //                 </div>
        //                 <div className='d-flex justify-content-between'>
        //                     {/* state input for location */}
        //                     <Form.Group controlId='state'>
        //                         <Form.Label>State</Form.Label>
        //                         <Form.Control
        //                             className={errors.state ? 'inputError' : ''}
        //                             {...register('state')}
        //                             onFocus={() => clearErrors('state')}
        //                             type='text'
        //                             name='state'
        //                             required
        //                         />
        //                         <div className='errormessage'>{errors.state?.message}</div>
        //                     </Form.Group>

        //                     {/* zip code input for location */}
        //                     <Form.Group controlId='zip'>
        //                         <Form.Label>Zip</Form.Label>
        //                         <Form.Control
        //                             className={errors.zip ? 'inputError' : ''}
        //                             {...register('zip')}
        //                             onFocus={() => clearErrors('zip')}
        //                             type='text'
        //                             name='zip'
        //                             required
        //                         />
        //                         <div className='errormessage'>{errors.zip?.message}</div>
        //                     </Form.Group>
        //                 </div>
        //             </div>
        //         )
        //     }

        //     {/* instgram input */}
        //     <Form.Group controlId='business_instagram'>
        //         <Form.Label>Instagram</Form.Label>
        //         <Form.Control
        //             className={errors.business_instagram ? 'inputError' : ''}
        //             {...register('business_instagram')}
        //             onFocus={() => clearErrors('business_instagram')}
        //             type='text'
        //             name='business_instagram'
        //         />
        //         <div className='errormessage'>{errors.business_instagram?.message}</div>
        //     </Form.Group>

        //     {/* website input */}
        //     <Form.Group controlId='business_website'>
        //         <Form.Label>Website</Form.Label>
        //         <Form.Control
        //             className={errors.business_website ? 'inputError' : ''}
        //             {...register('business_website')}
        //             onFocus={() => clearErrors('business_website')}
        //             type='text'
        //             name='business_website'
        //         />
        //         <div className='errormessage'>{errors.business_website?.message}</div>
        //     </Form.Group>

        //     {/* facebook input */}
        //     <Form.Group controlId='business_facebook'>
        //         <Form.Label>Facebook</Form.Label>
        //         <Form.Control
        //             className={errors.business_facebook ? 'inputError' : ''}
        //             {...register('business_facebook')}
        //             onFocus={() => clearErrors('business_facebook')}
        //             type='text'
        //             name='business_facebook'
        //         />
        //         <div className='errormessage'>{errors.business_facebook?.message}</div>
        //     </Form.Group>

        //     {/* phone input */}
        //     <Form.Group controlId='business_phone'>
        //         <Form.Label>Phone</Form.Label>
        //         <Form.Control
        //             className={errors.business_phone ? 'inputError' : ''}
        //             {...register('business_phone')}
        //             onFocus={() => clearErrors('business_phone')}
        //             type='text'
        //             name='business_phone'
        //         />
        //         <div className='errormessage'>{errors.business_phone?.message}</div>
        //     </Form.Group>

        //     {/* twitter input */}
        //     <Form.Group controlId='business_twitter'>
        //         <Form.Label>Twitter</Form.Label>
        //         <Form.Control
        //             className={errors.business_twitter ? 'inputError' : ''}
        //             {...register('business_twitter')}
        //             onFocus={() => clearErrors('business_twitter')}
        //             type='text'
        //             name='business_twitter'
        //         />
        //         <div className='errormessage'>{errors.business_twitter?.message}</div>
        //     </Form.Group>

        //     <Button type='submit'>Submit</Button>
        // </Form>
    )
}

export default BusinessCreateForm;