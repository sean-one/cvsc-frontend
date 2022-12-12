import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'react-bootstrap';

import useAuth from '../../../hooks/useAuth';
import { addBusinessSchema } from '../../../helpers/validationSchemas';
import { useAddBusinessMutation } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';

const CreateBusiness = () => {
    const { auth, setAuth } = useAuth()
    const [ imageFile, setImageFile ] = useState('')
    const { mutateAsync: addBusinessMutation } = useAddBusinessMutation()
    const { dispatch } = useNotification() 
    
    const { register, handleSubmit, watch, reset, clearErrors, setError, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(addBusinessSchema),
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

    const businessType = watch('business_type', 'brand')
    let navigate = useNavigate();

    const sendRequest = async (business_data) => {
        try {

            const formData = new FormData()

            Object.keys(business_data).forEach(key => {
                if(key === 'business_avatar') {
                    formData.set(key, imageFile)
                } else {
                    formData.append(key, business_data[key])
                }
            })
            
            const new_business = await addBusinessMutation(formData)
            
            if(new_business.status === 201) {
                
                const admin_role = {
                    business_id: new_business.data.id,
                    business_name: new_business.data.business_name,
                    active_role: new_business.data.active_role,
                    role_type: new_business.data.role_type
                }
        
                setAuth({ user: auth.user, roles: [...auth.roles, admin_role] })
        
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
            if(error.response.status === 400) {
                setError(`${error.response.data.error.type}`, {
                    type: 'server',
                    message: error.response.data.error.message
                })

            }

            if(error.response.status === 401) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error.response.data.error.message
                    }
                })

                navigate('/login')

            }

        }

    }


    return (
        <Form onSubmit={handleSubmit(sendRequest)} encType='multipart/form-data' className='gy-3'>
            {/* business name input */}
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

            {/* business email input */}
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
            <Form.Group controlId='business_avatar'>
                <Form.Label>Business Branding</Form.Label>
                <Form.Control
                    className={errors.business_avatar ? 'inputError' : ''}
                    {...register('business_avatar')}
                    onFocus={() => clearErrors('business_avatar')}
                    type='file'
                    name='business_avatar'
                    accept='image/*'
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
                <div className='errormessage'>{errors.business_avatar?.message}</div>
            </Form.Group>

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
                    required
                />
                <div className='errormessage'>{errors.business_description?.message}</div>
            </Form.Group>

            {/* business type option selector */}
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

            {/* if business type is dispensary or both, address option will display */}
            {
                (businessType !== 'brand') && (
                    <div>
                        <div>
                            {/* street address input for location */}
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
                        </div>
                        <div>
                            {/* city input for location */}
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
                        </div>
                        <div className='d-flex justify-content-between'>
                            {/* state input for location */}
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

                            {/* zip code input for location */}
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
                        </div>
                    </div>
                )
            }
            
            {/* instgram input */}
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

            <Button type='submit'>Submit</Button>
        </Form>
    )
}

export default CreateBusiness;