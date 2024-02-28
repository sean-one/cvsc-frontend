import React, { useState } from 'react';

import useNotification from '../../../hooks/useNotification';
import { useBusinessTransferMutation } from '../../../hooks/useBusinessApi';
import { useBusinessRolesQuery } from '../../../hooks/useRolesApi';
import { ShowIcon, HideIcon } from '../../icons/siteIcons';


const BusinessTransfer = ({ business_id }) => {
    const [transferManagerSelected, setTransferManagerSelected] = useState('');
    const [transferAdminEditView, setTransferAdminEditView] = useState(false)

    const { data: manager_list, isPending: managerListPening, isError: managerListError } = useBusinessRolesQuery(business_id)
    const { mutate: businessTransfer } = useBusinessTransferMutation()

    const handleManagerSelectChange = (e) => {
        setTransferManagerSelected(e.target.value)
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

    return (
        <div>
            <div className='businessAdminDetailSection'>
                <div className='businessAdminDetailText'>Transfer Business</div>
                <div className='businessTransferEdit' onClick={() => setTransferAdminEditView(!transferAdminEditView)}>{transferAdminEditView ? <HideIcon /> : <ShowIcon />}</div>
            </div>
            {
                transferAdminEditView
                    ? <div className='businessAdminDetailSection businessTransferSection'>

                        <div className='businessTransferDescription'>allows transfer of the business and business admin role to a manager</div>

                        {
                            (management_list?.length > 0) &&
                            <div className='businessTransferActionSection'>
                                <div className='businessTransferSelector'>
                                    <select value={transferManagerSelected} onChange={handleManagerSelectChange}>
                                        <option value=''>Select Manager...</option>
                                        {
                                            management_list?.map(manager => (
                                                <option key={manager.user_id} value={manager.user_id}>{manager.username}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className='businessTransferSubmitButton'>
                                    <button disabled={!isValidUUID(transferManagerSelected)} onClick={() => transferBusiness(transferManagerSelected)}>transfer</button>
                                </div>
                            </div>
                        }

                        <div className='businessTransferWarning'>{management_list?.length > 0 ? '* this action cannot be undone' : '* business can only be transferred to a current manager'}</div>
                    </div>
                    : null
            }
        </div>
    )
}

export default BusinessTransfer;