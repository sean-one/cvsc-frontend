import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'

import { useUserBusinessRole } from '../../../hooks/useRolesApi';
import { CreateEventIcon, EditIcon, SettingsIcon } from '../../icons/siteIcons';

const BusinessAdminControlStyles = styled.div`
    .businessAdminControls {
        display: flex;
        gap: 0.5rem;
    }
`

const BusinessAdminControls = ({ business }) => {
    const { data: user_business_role_response, status } = useUserBusinessRole(business?.id)
    let business_user_role = {};

    let navigate = useNavigate();

    if (status === 'success') {
        business_user_role = user_business_role_response?.data
    }

    console.log('inside the controls')
    console.log(business_user_role)
    
    return (
        <BusinessAdminControlStyles>
            {
                (Object.keys(business_user_role).length > 0) &&
                    <div className='businessAdminControls'>
                        {
                            (business.active_business) &&
                                <div onClick={() => navigate(`/event/create`, { state: business.id })}><CreateEventIcon /></div>
                        }
                        {
                            (((business_user_role.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT) && business.active_business) || (business_user_role.role_type >= process.env.REACT_APP_ADMIN_ACCOUNT)) &&
                                <div className='businessAdminControls'>
                                    <div onClick={() => navigate(`/business/edit/${business.id}`, { state: business })}><EditIcon /></div>
                                    <div onClick={() => navigate(`/business/admin/${business.id}`)}><SettingsIcon /></div>
                                </div>
                        }
                    </div>
            }
        </BusinessAdminControlStyles>
    )
}

export default BusinessAdminControls;