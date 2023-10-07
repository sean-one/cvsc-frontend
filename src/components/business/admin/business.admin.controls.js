import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'

import { CreateEventIcon, EditIcon, InactiveBusiness, SettingsIcon } from '../../icons/siteIcons';

const BusinessAdminControlStyles = styled.div`
    .businessAdminControls {
        display: flex;
        gap: 0.5rem;
    }x  
`

const BusinessAdminControls = ({ user_role, business }) => {
    let navigate = useNavigate()

    return (
        <BusinessAdminControlStyles>
            <div className='businessAdminControls'>
                {
                    (business.active_business)
                        ? <div onClick={() => navigate(`/event/create`, { state: business.id })}><CreateEventIcon /></div>
                        : <div><InactiveBusiness /></div>
                }
                {
                    (((user_role.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT) && business.active_business) || (user_role.role_type >= process.env.REACT_APP_ADMIN_ACCOUNT)) &&
                        <div className='businessAdminControls'>
                            <div onClick={() => navigate(`/business/edit/${business.id}`, { state: business })}><EditIcon /></div>
                            <div onClick={() => navigate(`/business/admin/${business.id}`)}><SettingsIcon /></div>
                        </div>
                }
            </div>
        </BusinessAdminControlStyles>
    )
}

export default BusinessAdminControls;