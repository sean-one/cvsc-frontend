import React from 'react';
import { useForm } from 'react-hook-form';

import LoadingSpinner from '../loadingSpinner';
import { useCreateRoleMutation } from '../../hooks/useRolesApi';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import { uuidPattern } from './utils/form.validations';

const RoleRequest = ({ user_roles }) => {
    const businessIdList = user_roles.map(role => role?.business_id) || []
    
    const { data: businessList, status } = useBusinessesQuery()
    const { mutateAsync: createRole } = useCreateRoleMutation()

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
            await createRole(data.business_id)
            reset()   
        } catch (error) {
            console.log('ERROR!')
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