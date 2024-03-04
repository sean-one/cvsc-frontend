import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../loadingSpinner';
import { useCreateRoleMutation } from '../../hooks/useRolesApi';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import { uuidPattern } from './utils/form.validations';

const RoleRequestStyles = styled.div`
    .noShowRoleRequest {
        text-align: center;

        div {
            margin-bottom: 1.5rem;
        }
    }
`;


const RoleRequest = ({ user_roles }) => {
    const businessIdList = user_roles.map(role => role?.business_id) || []
    const { dispatch } = useNotification();

    const { data: businesses_list, isPending, isError, error: businesses_list_error } = useBusinessesQuery()
    const { mutate: createRole } = useCreateRoleMutation()

    let navigate = useNavigate();

    const { register, handleSubmit, reset, clearErrors, watch, formState:{ errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            business_id: ''
        }
    });

    // make sure business id is selected or submit button is disabled
    const selectedBusinessId = watch('business_id');

    if (isError) {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: businesses_list_error?.response?.data?.error?.message
            }
        })
    }

    if (isPending) { return <LoadingSpinner /> }

    // filter out businesses that are not currently excepting request
    const request_open = businesses_list.data.filter(business => business.business_request_open && business.active_business)
    // filter out the businesses that the user already has role rights to
    const business_filtered = request_open.filter(business => !businessIdList.includes(business.id))
    
    const roleCreate = async (data) => {
        if(!data.business_id) return
        reset() 
        createRole(data.business_id)
    }


    return (
        <RoleRequestStyles>
            <div>
                {
                    (business_filtered.length > 0)
                        ? <div className='sectionContainer'>
                            <div className='subheaderText'>Create Business Role Request</div>

                            <form onSubmit={handleSubmit(roleCreate)} className='standardForm'>
                                <select {...register('business_id', {
                                    required: 'valid business is required',
                                    pattern: uuidPattern
                                })} type='text' onClick={() => clearErrors('business_id')}>
                                    <option value=''>Select a business...</option>
                                    {
                                        business_filtered.map(business => (
                                            <option key={business.id} value={business.id}>
                                                {business.business_name.toUpperCase()}
                                            </option>
                                        ))
                                    }
                                </select>
                                {errors.business_id ? <div className='errormessage'>{errors.business_id?.message}</div> : null}
                                <button disabled={!selectedBusinessId} type='submit'>Submit Role Request</button>
                            </form>
                        </div>
                        : <div className='noShowRoleRequest'>
                            <div>Role request will be shown when more businesses are available.</div>
                            <div onClick={() => navigate('/business/create')}>click here to create a new business</div>
                        </div>
                }
            </div>
        </RoleRequestStyles>
    )
}

export default RoleRequest;