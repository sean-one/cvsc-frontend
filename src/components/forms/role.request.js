import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import LoadingSpinner from '../loadingSpinner';
import useNotification from '../../hooks/useNotification';
import useAuth from '../../hooks/useAuth';
import { useCreateRoleMutation } from '../../hooks/useRolesApi';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import { uuidPattern } from './form.validations';

const RoleRequestStyles = styled.div`
    .roleRequest {
        padding: 1.5rem 0.5rem;
        border-radius: 5px;
        border: 1px solid #263238;
        box-shadow: 5px 5px 5px var(--box-shadow-color);
    }

    .roleRequestHeader {
        font-weight: bold;
        letter-spacing: 0.1rem;
    }
`;

const RoleRequest = () => {
    const { auth, setAuth } = useAuth()
    const businessIdList = auth.roles.map(role => role?.business_id) || []
    
    const { dispatch } = useNotification();
    const { data: businessList, isLoading } = useBusinessesQuery()
    const { mutateAsync: createRole } = useCreateRoleMutation()

    const { register, handleSubmit, reset, clearErrors, formState:{ errors } } = useForm({
        mode: 'onBlur',
    });
    
    if(isLoading) { return <LoadingSpinner /> }

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
        <RoleRequestStyles>
            {
                (business_filtered.length > 0) &&
                    <div className='roleRequest'>
                        <div className='roleRequestHeader'>
                            <div>Create Business Role Request</div>
                        </div>

                        <form onSubmit={handleSubmit(roleCreate)} className='standardForm'>
                            <select {...register('business_id', {
                                required: 'valid business is required',
                                pattern: uuidPattern
                            })} className='formInput' type='text' onClick={() => clearErrors('business_id')}>
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
        </RoleRequestStyles>
    )
}

export default RoleRequest;