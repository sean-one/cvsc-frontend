import React from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components'
import BusinessButton from '../../business/buttons/business.button';
import SettingsBusinessButton from '../../business/buttons/settings.business.button';
import { image_link } from '../../../helpers/dataCleanUp';

const ManagementListItemStyles = styled.div`
    .managementListItemWrapper {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        width: 100%;
        margin: 1.5rem 0;
        padding: 0.75rem;
        border: 1px solid var(--trim-color);
        border-radius: 15px;
    }

    .managementListItemLogo {
        width: 100%;
        max-width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1.125rem 0.75rem;

        img {
            width: 100%;
            border: 1px solid var(--trim-color);
            display: block;
            border-radius: 50%;
        }
    }

    .managementListItemDetails {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        margin: 0.75rem;
    }

    .managementListItemBusinessname {
        font-weight: bold;
        font-size: 1.8rem;
        letter-spacing: 1.5;
    }

    .managementListItemStatus {
        font-size: 1.2rem;
    }

    .managementListItemAdminButton {
        margin-top: 0.75rem;
        display: flex;
        gap: 1.5rem;
        align-self: flex-end;
    }
`


const ManagementListItem = ({ business }) => {
    let navigate = useNavigate()


    return (
        <ManagementListItemStyles>
            <div className='managementListItemWrapper'>
                <div className='managementListItemLogo' onClick={() => navigate(`/business/${business.id}`)}>
                    <img src={image_link(business?.business_avatar)} alt={business.business_name} />
                </div>
                <div className='managementListItemDetails'>
                    <div className='managementListItemBusinessname'>{business.business_name}</div>
                    <div className='managementListItemStatus'>
                        <span style={{ color: business.active_business ? 'inherit' : `var(--error-color)` }}>
                            {business.active_business ? 'Active' : 'Inactive'}
                        </span>
                        {' / '}
                        <span style={{ color: business.business_request_open ? 'inherit' : `var(--error-color)` }}>
                            {business.business_request_open ? 'Request Open' : 'Request Closed'}
                        </span>
                    </div>
                    <div>{business?.role_type}</div>

                    <div className='managementListItemAdminButton'>
                        <BusinessButton business_id={business?.id} />
                        <SettingsBusinessButton business_id={business?.id} />
                    </div>
                </div>
            </div>
        </ManagementListItemStyles>
    )
}

export default ManagementListItem;