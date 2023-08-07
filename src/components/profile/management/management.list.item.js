import React from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components'
import { image_link } from '../../../helpers/dataCleanUp';

const ManagementListItemStyles = styled.div`
    .managementListItemWrapper {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: stretch;
        margin: 1rem 0;
        padding: 0.5rem;
        box-shadow: 5px 5px 5px var(--box-shadow-color);
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
            border: 1px solid #dcdbc4;
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

    .managementListItemStatus {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        gap: 10px;
    }

    .managementListItemBusinessname {
        font-weight: bold;
        font-size: 1.2rem;
        letter-spacing: 1.5;
    }

    .managementListItemAdminButton {
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
                    <div className='managementListItemStatus'>
                        <div>{`Business: ${business.active_business ? 'Active' : 'Inactive'}`}</div>
                        <div>{`Request: ${business.business_request_open ? 'Open' : 'Closed'}`}</div>
                    </div>
                    <div>{business.business_type === 'both' ? `Dispensary / Brand` : `${business.business_type.charAt(0).toUpperCase() + business.business_type.slice(1)}`}</div>
                    <div className='managementListItemBusinessname'>{business.business_name}</div>
                    <div className='managementListItemAdminButton'>
                        <button onClick={() => navigate(`/business/admin/${business.id}`)}>admin</button>
                    </div>
                </div>
            </div>
        </ManagementListItemStyles>
    )
}

export default ManagementListItem;