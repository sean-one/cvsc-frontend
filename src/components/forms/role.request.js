import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import { roleRequestSchema } from '../../helpers/validationSchemas';
import LoadingSpinner from '../loadingSpinner';
import useNotification from '../../hooks/useNotification';
import useAuth from '../../hooks/useAuth';
import { useCreateRoleMutation } from '../../hooks/useRolesApi';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';

const Styles = styled.div`
    .roleRequest {
        padding: 1.5rem 0.5rem;
        border-radius: 5px;
        box-shadow: 5px 5px 5px #0D2B12;
    }

    .roleRequestHeader {
        font-weight: bold;
        letter-spacing: 0.1rem;
    }

    .roleRequestForm {
        display: flex;
        justify-content: space-between;
        align-items: center;

        select {
            margin-right: 0.5rem;
        }
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
        resolver: yupResolver(roleRequestSchema)
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
        <Styles>
            {
                (business_filtered.length > 0) &&
                    <div className='roleRequest'>
                        <div className='roleRequestHeader'>
                            <div>Create Business Role Request</div>
                        </div>

                        <form className='roleRequestForm'>
                            <select
                                {...register('business_id')}
                                className={errors.business_id ? 'inputError' : ''}
                                onFocus={() => clearErrors('business_id')}
                                type='text'
                                name='business_id'
                                required
                            >
                                {
                                    business_filtered.map(business => (
                                        <option key={business.id} value={business.id}>{business.business_name.toUpperCase()}</option>
                                    ))
                                }
                            </select>

                            <button type='submit' onClick={handleSubmit(roleCreate)}><FontAwesomeIcon icon={faCheck} /></button>
                        </form>

                        <div className='errormessage'>
                            {errors.business_id?.message}
                        </div>
                    </div>
            }
        </Styles>
    )
}

export default RoleRequest;