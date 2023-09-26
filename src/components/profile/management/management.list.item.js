import React from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components'
import { SettingsIcon, BusinessIcon } from '../../icons/siteIcons';
import { image_link } from '../../../helpers/dataCleanUp';

const ManagementListItemStyles = styled.div`
    .managementListItemWrapper {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        width: 100%;
        margin: 1rem 0;
        padding: 0.5rem;
        border: 1px solid var(--trim-color);
        border-radius: 15px;
    }

    .managementListItemLogo {
        width: 100%;
        max-width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.75rem 0.5rem;

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
        margin: 0.5rem;
        /* margin-left: 0.5rem; */
    }

    .managementListItemBusinessname {
        font-weight: bold;
        font-size: 1.2rem;
        letter-spacing: 1.5;
    }

    .managementListItemStatus {
        font-size: 0.8rem;
    }

    .managementListItemAdminButton {
        margin-top: 0.5rem;
        display: flex;
        gap: 1rem;
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
                    <div>{business.business_type === 'both' ? `Dispensary / Brand` : `${business.business_type.charAt(0).toUpperCase() + business.business_type.slice(1)}`}</div>
                    <div className='managementListItemBusinessname'>{business.business_name}</div>
                    <div className='managementListItemStatus'>{`${business.active_business ? 'Active' : 'Inactive'} / ${business.business_request_open ? 'Request Open' : 'Request Closed'}`}</div>
                    <div className='managementListItemAdminButton'>
                        <div onClick={() => navigate(`/business/${business.id}`)}><BusinessIcon /></div>
                        <div onClick={() => navigate(`/business/admin/${business.id}`)}><SettingsIcon /></div>
                    </div>
                </div>
            </div>
        </ManagementListItemStyles>
    )
}

export default ManagementListItem;