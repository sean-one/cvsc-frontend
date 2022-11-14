import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { withRouter, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'react-bootstrap';

import { addBusinessSchema } from '../../../helpers/validationSchemas';
import { useAddBusinessMutation } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';
import { UsersContext } from '../../../context/users/users.provider';

const CreateBusiness = () => {
    const [ imageFile, setImageFile ] = useState('')
    const { mutateAsync: addBusinessMutation, error: addError } = useAddBusinessMutation()
    const { addUserRole } = useContext(UsersContext)
    const { dispatch } = useNotification() 
    
    const { register, handleSubmit, watch, reset, clearErrors, setError, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(addBusinessSchema),
        defaultValues: {
            business_name: null,
            business_email: null,
            business_avatar: '',
            business_description: null,
            business_type: '',
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
            formData.append('business_name', business_data.business_name)
            formData.append('business_email', business_data.business_email)
            formData.set('business_avatar', imageFile)
            formData.append('business_description', business_data.business_description)
            formData.append('business_type', business_data.business_type)
            formData.append('street_address', business_data.street_address)
            formData.append('city', business_data.city)
            formData.append('state', business_data.state)
            formData.append('zip', business_data.zip)
            formData.append('business_instagram', business_data.business_instagram)
            formData.append('business_facebook', business_data.business_facebook)
            formData.append('business_website', business_data.business_website)
            formData.append('business_phone', business_data.business_phone)
            formData.append('business_twitter', business_data.business_twitter)
            
            const new_business = await addBusinessMutation(formData)
            
            if(new_business.status === 201) {
                
                const admin_role = {
                    business_id: new_business.data.id,
                    business_name: new_business.data.business_name,
                    active_role: new_business.data.active_role,
                    role_type: new_business.data.role_type
                }
        
                addUserRole(admin_role)
        
                // delete business.data['active_role']
                // delete business.data['role_type']
        
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${new_business.data.business_name} business request submitted`
                    }
                })
    
                // removes user from local storage so it is refetch next time profile is loaded
                localStorage.removeItem('user')

                reset()
        
                navigate(`/business/${new_business.data.id}`)
                // history.push({
                //     pathname: `/business/${new_business.data.id}`,
                //     state: {
                //         business_id: new_business.data.id,
                //     }
                // })
    
            }
        } catch (error) {
            if(addError.response.status === 400) {
                setError(`${addError.response.data.error.type}`, {
                    type: 'server',
                    message: addError.response.data.error.message
                })

            }
        }

        //     dispatch({
        //         type: "ADD_NOTIFICATION",
        //         payload: {
        //             notification_type: 'ERROR',
        //             message: `something is wrong in new business creation`
        //         }
        //     })
        // }
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

            {/* business avatar random link */}
            <Form.Group>
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