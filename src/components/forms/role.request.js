import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import LoadingSpinner from '../loadingSpinner';
import useNotification from '../../hooks/useNotification';
import useAuth from '../../hooks/useAuth';
import { useCreateRoleMutation } from '../../hooks/useRolesApi';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import { uuidPattern } from './form.validations';

const RoleRequest = () => {
    const { auth, setAuth } = useAuth()
    const businessIdList = auth?.roles.map(role => role?.business_id) || []
    
    const { dispatch } = useNotification();
    const { data: businessList, status } = useBusinessesQuery()
    const { mutateAsync: createRole } = useCreateRoleMutation()

    let navigate = useNavigate()

    const { register, handleSubmit, reset, clearErrors, formState:{ errors } } = useForm({
        mode: 'onBlur',
    });
    
    if(status === 'loading') { return <LoadingSpinner /> }

    // filter out businesses that are not currently excepting request
    const request_open = businessList.data.filter(business => business.business_request_open && business.active_business)
    // filter out the businesses that the user already has role rights to
    const business_filtered = request_open.filter(business => !businessIdList.includes(business.id))
    
    const roleCreate = async (data) => {
        try {
            if(!data.business_id) return
    
            // const request_response = await createRole(data.business_id)
            const request_response = await createRole('e8728dd1-5ed5-4d6b-bc07-810aa79c8a5f')
            
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
            if (error?.response?.status === 401) {
                navigate('/login', { state: { from: `/profile/roles` } })

                return false
            }

            if (error?.response?.status === 400) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })
            }
            console.log(error)
        } finally {
            reset()
        }
    }


    return (
        <div>
            {
                (business_filtered.length > 0) &&
                <div className='sectionContainer'>
                        <div className='subheaderText'>Create Business Role Request</div>

                        <form onSubmit={handleSubmit(roleCreate)} className='standardForm'>
                            <select {...register('business_id', {
                                required: 'valid business is required',
                                pattern: uuidPattern
                            })} type='text' onClick={() => clearErrors('business_id')}>
                                {
                                    business_filtered.map(business => (
                                        <option key={business.id} value={business.id}>
                                            {business.business_name.toUpperCase()}
                                        </option>
                                    ))
                                }
                            </select>
                            {errors.business_id ? <div className='errormessage'>{errors.business_id?.message}</div> : null}
                            <button type='submit'>Submit Role Request</button>
                        </form>
                    </div>
            }
        </div>
    )
}

export default RoleRequest;