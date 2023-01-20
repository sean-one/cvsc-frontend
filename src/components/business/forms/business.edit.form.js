import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FloatingLabel, Form, Image } from 'react-bootstrap';

import useAuth from '../../../hooks/useAuth';
import { image_link } from '../../../helpers/dataCleanUp';
// import { businessFormSchema } from '../../../helpers/validationSchemas';
import { useUpdateBusinessMutation } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';


const BusinessEditForm = () => {
    const { auth } = useAuth()
    const { business_id } = useParams()
    const { mutateAsync: updateBusiness } = useUpdateBusinessMutation()
    const { dispatch } = useNotification()
    const { state: business } = useLocation()
    const [ imageFile, setImageFile ] = useState(business.business_avatar)
    let business_role = {}

    let navigate = useNavigate()

    const { register, handleSubmit, clearErrors, watch, formState: { isDirty, dirtyFields, errors } } = useForm({
        mode: 'onBlur',
        // resolver: yupResolver(businessFormSchema),
        defaultValues: {
            business_email: business?.business_email,
            business_description: business?.business_description,
            business_avatar: '',
            business_type: business?.business_type,
            business_instagram: business?.business_instagram,
            business_website: business?.business_website,
            business_facebook: business?.business_facebook,
            business_phone: business?.business_phone,
            business_twitter: business?.business_twitter,
            street_address: business?.street_address,
            city: business?.location_city,
            state: business?.location_state,
            zip: business?.zip_code,
            business_location: false,
            image_attached: false,
        }
    })

    if(auth?.roles) {
        business_role = auth.roles.find(role => role.business_id === business_id )
    }

    const image_attached = watch('image_attached', false)
    const business_location = watch('business_location', false)

    const update_business = async (data) => {
        try {
            const formData = new FormData()

            // if updatelocation is true append new address
            if ((data.business_location !== false) && (business_role.role_type === process.env.REACT_APP_ADMIN_ACCOUNT)) {
                formData.append('location_id', business?.location_id || 'new_location')
                formData.append('street_address', data.street_address)
                formData.append('city', data.city)
                formData.append('state', data.state)
                formData.append('zip', data.zip)
            }

            // remove location fields
            delete data['street_address']
            delete data['city']
            delete data['state']
            delete data['zip']
            delete data['business_location']

            // if updateimage is true set updated file
            if (data?.business_avatar[0] && (business_role.role_type === process.env.REACT_APP_ADMIN_ACCOUNT)) {
                formData.set('business_avatar', data['business_avatar'][0])
            }

            delete data['business_avatar']
            delete data['image_attached']

            // remove entries that are unchanged
            for (const [key] of Object.entries(data)) {
                if (!Object.keys(dirtyFields).includes(key)) {
                    delete data[key]
                }
            }

            // append eveything left changed to formData
            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })

            const update_response = await updateBusiness({ business_updates: formData, business_id: business.id })
            
            if (update_response.status === 201) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${update_response.data.business_name} has been updated`

                    }
                })

                navigate(`/business/${update_response.data.id}`)
            }

        } catch (err) {
            console.log('inside the catch of the update function')
            console.log(err)
        }

    }

    const image_preview = (e) => {
        if(e.target.files.length !== 0) {
            setImageFile(URL.createObjectURL(e.target.files[0]))
        } else {
            setImageFile(imageFile)
        }
    }

    
    return (
        <>
            <h1>{business?.business_name}</h1>
            <Form onSubmit={handleSubmit(update_business)} encType='multipart/form-data'>

                {
                    (business_role?.role_type === process.env.REACT_APP_ADMIN_ACCOUNT) &&
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
                }
                
                <div className='d-flex justify-content-center mb-2'>
                    <Image
                        src={image_link(imageFile)}
                        alt={business.business_name}
                        thumbnail
                    />
                </div>

                {
                    (business_role?.role_type === process.env.REACT_APP_ADMIN_ACCOUNT) &&
                        <Form.Group controlId='image_attached'>
                            <Form.Check {...register('image_attached')} type='checkbox' label='Update Image' className='mb-2' />
                        </Form.Group>
                }
                {
                    (image_attached) &&
                    <Form.Group controlId='business_avatar' className='mb-2'>
                        <Form.Control
                            className={errors.business_avatar ? 'inputError' : ''}
                            {...register('business_avatar')}
                            onFocus={() => clearErrors('business_avatar')}
                            type='file'
                            name='business_avatar'
                            accept='image/*'
                            onChange={(e) => image_preview(e)}
                        />
                        <div className='errormessage'>{errors.business_avatar?.message}</div>
                    </Form.Group>
                }

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

                {
                    (business_role?.role_type === process.env.REACT_APP_ADMIN_ACCOUNT) &&
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
                                <Form.Check {...register('business_location')} type='checkbox' label='Update Location' className='mb-2' />
                            </Form.Group>
                        </div>
                }

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

                <div className='d-flex justify-content-around pt-3'>
                    <Button type='submit' disabled={!isDirty}>Update</Button>
                    <Button onClick={() => navigate(`/business/${business.id}`)} variant='secondary'>Close</Button>
                </div>

            </Form>
        </>
    )
}

export default BusinessEditForm;