import React from 'react';
import styled from 'styled-components'

import useAuth from '../../../hooks/useAuth';
import { useUserRolesQuery } from '../../../hooks/useRolesApi';
import EditBusinessButton from '../buttons/edit.business.button';
import CreateEventButton from '../../events/create.event.button';
import SettingsBusinessButton from '../buttons/settings.business.button';

const BusinessAdminControlStyles = styled.div`
    .businessAdminControls {
        display: flex;
        gap: 0.75rem;
    }
`

const BusinessAdminControls = ({ business }) => {
    const { auth } = useAuth();
    const { data: user_roles, status: user_roles_status } = useUserRolesQuery(auth?.user?.id)
    let business_user_role = {};

    if (user_roles_status === 'success') {
        business_user_role = user_roles?.data.find(role => role.business_id === business.id && role.active_role) || {}
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
                            (((business_user_role.role_type >= 456) && business.active_business) || (business_user_role.role_type >= 789)) &&
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