import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';

import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../loadingSpinner';
import { useCreateRoleMutation } from '../../hooks/useRolesApi';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import { uuidPattern } from './utils/form.validations';

const RoleRequestStyles = styled.div`
    .roleRequestWrapper {
        margin-top: 1rem;
        width: 100%;
        display: flex;
        justify-content: center;
    }
    
    .roleRequestHeader {
        padding-left: 1rem;
        margin: 1rem 0;
        color: var(--main-highlight-color);
    }

    .roleRequestSection {
        width: 100%;
        max-width: var(--max-section-width);
        border-radius: 0.5rem;
    }

    .noShowRoleRequest {
        max-width: var(--max-section-width);
        padding-top: 1rem;
        text-align: center;

        div {
            margin-bottom: 1.5rem;
        }
    }
`;

const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'var(--main-background-color)',
        fontSize: 'var(--input-font-size)',
        color: 'var(--text-color)',
        borderColor: 'var(--text-color)',
        boxShadow: state.isFocused ? '0 0 0 1px var(--text-color)' : provided.boxShadow,
        '&:hover': {
            borderColor: 'var(--text-color)',
        }
    }),
    input: (provided) => ({
        ...provided,
        color: 'var(--text-color)',
        fontSize: 'var(--input-font-size)',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'var(--text-color)',
        fontSize: 'var(--input-font-size)',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'var(--input-placeholder)',
        fontSize: 'var(--input-font-size)',
    }),
    valueContainer: (provided) => ({
        ...provided,
        color: 'var(--text-color)',
        fontSize: 'var(--input-font-size)',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'var(--text-color)',
        fontSize: 'var(--input-font-size)',
        '&:hover': {
            color: 'var(--text-color)',
        }
    }),
    clearIndicator: (provided) => ({
        ...provided,
        color: 'var(--text-color)',
        '&:hover': {
            color: 'var(--error-color)',
        }
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'var(--main-background-color)',
        fontSize: 'var(--input-font-size)'
    }),
    option: (provided) => ({
        ...provided,
        backgroundColor: 'var(--main-background-color)',
        color: 'var(--text-color)',
        fontSize: 'var(--input-font-size)',
    })
}


const RoleRequest = ({ user_roles }) => {
    const businessIdList = useMemo(() => user_roles.map(role => role?.business_id) || [], [user_roles]);
    const [ filteredBusinessList, setFilteredBusinessList] = useState([])
    const { dispatch } = useNotification();
    
    const { data: businesses_list, isPending, isSuccess: businessListSuccess, isError } = useBusinessesQuery()
    const { mutate: createRole } = useCreateRoleMutation()
    
    let navigate = useNavigate();
    
    const { control, handleSubmit, reset, clearErrors, watch, setValue, formState:{ errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            business_id: ''
        }
    });
    
    useEffect(() => {
        if (businessListSuccess) {
            const businessListData = businesses_list?.data || []
            if (businessListData.length === 0) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'No businesses found'
                    }
                })

                return
            }

            const list = businessListData.filter(business => 
                business.business_request_open &&
                business.active_business &&
                !businessIdList.includes(business.id)
            ).map(businessMap => ({ value: businessMap.id, label: businessMap.business_name }))

            setFilteredBusinessList(list)
        }
    }, [businesses_list, businessListSuccess, businessIdList, dispatch])

    // make sure business id is selected or submit button is disabled
    const selectedBusinessId = watch('business_id');
    
    const roleCreate = async (data) => {
        if(!data.business_id.value) return
        reset() 
        createRole(data.business_id.value)
    }


    return (
        <RoleRequestStyles>
            {
                isPending ? (
                    <LoadingSpinner />
                ) : isError ? (
                    null
                ) : (
                    <div className='roleRequestWrapper'>
                        {
                            (filteredBusinessList.length > 0)
                                ? <div className='roleRequestSection'>
                                    <div className='subheaderText roleRequestHeader'>Create Business Role Request</div>

                                    <form onSubmit={handleSubmit(roleCreate)} className='standardForm'>
                                        <div className='inputWrapper' onClick={() => clearErrors('business_id')}>
                                            <label htmlFor='business_id' className='visuallyHidden'>Businesses</label>
                                            <Controller
                                                name='business_id'
                                                control={control}
                                                rules={{
                                                    required: 'valid business is required',
                                                    pattern: uuidPattern
                                                }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        options={filteredBusinessList}

                                                        placeholder='Select a business'
                                                        isClearable
                                                        isSearchable
                                                        styles={customSelectStyles}
                                                        onChange={(selectedOption) => {
                                                            field.onChange(selectedOption);
                                                            setValue('business_id', selectedOption, { shouldDirty: true });
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                        {errors.business_id ? <div className='errormessage'>{errors.business_id?.message}</div> : null}
                                        <div className='formButtonWrapper'>
                                            <button className='formButton' disabled={!selectedBusinessId} type='submit'>Submit Request</button>
                                        </div>
                                    </form>
                                </div>
                                : <div className='noShowRoleRequest'>
                                    <div>Currently no new businesses accepting Role request.  Check back when more become available</div>
                                    <div className='formButtonWrapper'>
                                        <div className='buttonLike formButton' onClick={() => navigate('/business/create')}>Create Business</div>
                                    </div>
                                </div>
                        }
                    </div>
                )
            }
        </RoleRequestStyles>
    )
}

export default RoleRequest;