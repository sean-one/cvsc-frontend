import React from 'react';
import { useNavigate } from 'react-router-dom';
import { decode } from 'he';

import styled from 'styled-components'
import BusinessButton from '../../business/buttons/business.button';
import SettingsBusinessButton from '../../business/buttons/settings.business.button';

const ManagementListItemStyles = styled.div`
    .managementListItemWrapper {
        width: 100%;
        max-width: var(--max-section-width);
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        margin: 0.5rem auto;
        padding: 0.75rem;
        border: 0.1rem solid var(--text-color);
        border-radius: 1.5rem;
        background: var(--opacity);
    }

    .managementListItemLogo {
        width: clamp(8rem, 25vw, 10rem);
        max-width: 10rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1.125rem 0.75rem;

        img {
            width: 100%;
            border: 0.3rem solid var(--text-color);
            display: block;
            border-radius: 50%;
        }
    }

    .managementListItemDetails {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        margin: 0.75rem;
    }
    
    .managementListItemBusinessname {
        width: 100%;
        color: var(--main-highlight-color);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: normal;
        letter-spacing: 1.5;
    }

    .managementListItemAdminButton {
        color: var(--main-highlight-color);
        display: flex;
        gap: 1.5rem;
        align-self: flex-end;
    }
`;


const ManagementListItem = ({ business }) => {
    let navigate = useNavigate()


    return (
        <ManagementListItemStyles>
            <div className='managementListItemWrapper'>
                <div className='managementListItemLogo' onClick={() => navigate(`/business/${business.id}`)}>
                    <img src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${business?.business_avatar}`} alt={decode(business.business_name)} />
                </div>
                <div className='managementListItemDetails'>
                    <div className='subheaderText managementListItemBusinessname'>{decode(business.business_name)}</div>
                    <div className='smallText'>
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