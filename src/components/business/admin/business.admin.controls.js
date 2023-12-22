import React from 'react';
import styled from 'styled-components'

import { useUserBusinessRole } from '../../../hooks/useRolesApi';
import EditBusinessButton from '../buttons/edit.business.button';
import CreateEventButton from '../../events/create.event.button';
import SettingsBusinessButton from '../buttons/settings.business.button';

const BusinessAdminControlStyles = styled.div`
    .businessAdminControls {
        display: flex;
        gap: 0.5rem;
    }
`

const BusinessAdminControls = ({ business }) => {
    const { data: user_business_role_response, status } = useUserBusinessRole(business?.id)
    let business_user_role = {};

    if (status === 'success') {
        business_user_role = user_business_role_response?.data
    }

    
    return (
        <BusinessAdminControlStyles>
            {
                (Object.keys(business_user_role).length > 0) &&
                    <div className='businessAdminControls'>
                        {
                            (business.active_business) &&
                                <CreateEventButton business_id={business?.id} />
                        }
                        {
                            (((business_user_role.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT) && business.active_business) || (business_user_role.role_type >= process.env.REACT_APP_ADMIN_ACCOUNT)) &&
                                <div className='businessAdminControls'>
                                    <EditBusinessButton business={business} />
                                    <SettingsBusinessButton business_id={business?.id} />
                                </div>
                        }
                    </div>
            }
        </BusinessAdminControlStyles>
    )
}

export default BusinessAdminControls;