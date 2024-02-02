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

// visible in business view when user is logged in
const BusinessAdminControls = ({ business }) => {
    const { auth } = useAuth();
    // if any errors are hit do nothing and show nothing
    const { data: user_roles } = useUserRolesQuery(auth?.user?.id)
    let business_user_role = {};

    business_user_role = user_roles?.data.find(role => role.business_id === business.id && role.active_role) || {}


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
                            (((business_user_role.role_type === 'manager') && business.active_business) || (business_user_role.role_type === 'admin')) &&
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