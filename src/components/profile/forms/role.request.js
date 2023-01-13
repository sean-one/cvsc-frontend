import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FloatingLabel, Form } from 'react-bootstrap';

import { roleRequestSchema } from '../../../helpers/validationSchemas';
import LoadingSpinner from '../../loadingSpinner';
import useNotification from '../../../hooks/useNotification';
import useAuth from '../../../hooks/useAuth';
import { useCreateRoleMutation } from '../../../hooks/useRolesApi';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';


const RoleRequest = () => {
    const { auth, setAuth } = useAuth()
    const businessIdList = auth.roles.map(role => role?.business_id) || []
    
    const { dispatch } = useNotification();
    const { data: businessList, isLoading } = useBusinessesQuery()
    const { mutateAsync: createRole } = useCreateRoleMutation()

    const { register, handleSubmit, reset, clearErrors, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(roleRequestSchema)
    });
    
    if(isLoading) {
        return <LoadingSpinner />
    }

    // filter out businesses that are not currently excepting request
    const request_open = businessList.data.filter(business => business.business_request_open && business.active_business)
    // filter out the businesses that the user already has role rights to
    const business_filtered = request_open.filter(business => !businessIdList.includes(business.id))
    
    const roleCreate = async (data) => {
        try {
            if(!data.business_id) return
    
            const request_response = await createRole(data.business_id)
            
            if(request_response.status === 201) {
                setAuth({ user: auth.user, roles: [ ...auth.roles, request_response.data ] })
    
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'your request has been submitted for approval'
                    }
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            reset()
        }
    }


    return (
        <Form onSubmit={handleSubmit(roleCreate)}>
            <div className='d-flex justify-content-between align-items-center'>
                <div className='flex-fill px-0'>
                    <Form.Group controlId='business_id'>
                        <FloatingLabel controlId='business_id' label='Creator Request' className='mb-2'>
                            <Form.Select
                                className={errors.business_id ? 'inputError' : ''}
                                onFocus={() => clearErrors('business_id')}
                                {...register('business_id')}
                                type='text'
                                name='business_id'
                                required
                            >
                                {
                                    business_filtered.map(business => (
                                        <option key={business.id} value={business.id}>{business.business_name}</option>
                                    ))
                                }
                            </Form.Select>
                        </FloatingLabel>
                    </Form.Group>
                </div>
                <div className='ms-2 align-self-center'>
                    <Button type='submit'> + </Button>
                </div>
            </div>
            <div className='errormessage px-3'>
                {errors.business_id?.message}
            </div>
        </Form>
    )
}

export default RoleRequest;