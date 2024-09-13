import React, { useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { decode } from 'he';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa6';

import { useBusinessTransferMutation } from '../../../hooks/useBusinessApi';
import { useBusinessRolesQuery } from '../../../hooks/useRolesApi';

const BusinessTransferStyles = styled.div`
    .businessTransferDescription {
        width: 100%;
        color: var(--main-highlight-color);
        font-size: var(--small-font);
    }
    
    .businessTransferSelector {
        width: 100%;
    }

    .businessTransferActionSection {
        display: flex;
        flex-direction: column;
        /* justify-content: space-between; */
        /* align-items: center; */
        width: 100%;
        /* gap: 1rem; */
    }

    .businessTransferWarning {
        width: 100%;
        font-size: var(--small-font);
        color: var(--error-color);
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


const BusinessTransfer = ({ business_id }) => {
    const [transferManagerSelected, setTransferManagerSelected] = useState(null);
    const [transferAdminEditView, setTransferAdminEditView] = useState(false)
    // get a list of managers for the business, return nothing in case of error
    const { data: manager_list } = useBusinessRolesQuery(business_id)
    const { mutate: businessTransfer } = useBusinessTransferMutation()

    const handleManagerSelectChange = (selectedOption) => {
        setTransferManagerSelected(selectedOption);
    }

    // Function to validate UUID
    const isValidUUID = (value) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regex.test(value);
    };

    const transferBusiness = (manager_id) => {
        businessTransfer({ business_id: business_id, manager_id: manager_id })
    }

    const management_list = manager_list?.data?.filter(manager_role => manager_role.role_type === 'manager') || []
    const managerSelectOptions = management_list.map(manager => ({
        value: manager.user_id,
        label: decode(manager.username)
    }))

    return (
        <BusinessTransferStyles>
            <div>
                <div className='businessAdminDetailSection'>
                    <div className='businessAdminDetailText'>Transfer Business</div>
                    <div onClick={() => setTransferAdminEditView(!transferAdminEditView)}>{transferAdminEditView ? <FaCaretUp className='siteIcons' /> : <FaCaretDown className='siteIcons' />}</div>
                </div>
                {
                    transferAdminEditView
                        ? <div className='businessAdminDetailSection businessTransferSection'>

                            <div className='businessTransferDescription'>allows transfer of the business and business admin role to a manager</div>

                            {
                                (management_list?.length > 0) &&
                                <div className='businessTransferActionSection'>
                                    <div className='businessTransferSelector'>
                                        <Select
                                            options={managerSelectOptions}
                                            placeholder='Select Manager'
                                            isClearable
                                            isSearchable
                                            styles={customSelectStyles}
                                            onChange={handleManagerSelectChange}
                                            value={transferManagerSelected}
                                        />
                                    </div>
                                    <div className='formButtonWrapper'>
                                        <button
                                            className='formButton'
                                            disabled={!transferManagerSelected || !isValidUUID(transferManagerSelected.value)}
                                            onClick={() => transferBusiness(transferManagerSelected.value)}>transfer</button>
                                    </div>
                                </div>
                            }

                            <div className='businessTransferWarning'>{management_list?.length > 0 ? '* this action cannot be undone' : '* business can only be transferred to a current manager'}</div>
                        </div>
                        : null
                }
            </div>
        </BusinessTransferStyles>
    )
}

export default BusinessTransfer;