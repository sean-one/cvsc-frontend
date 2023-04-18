import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { UsersGroupIcon } from '../../icons/siteIcons';

import ActiveBusinessToggle from './active.business.toggle';
import RequestStatusToggle from './request.status.toggle';
import DeleteBusiness from './delete.business';
import EditBusinessButton from './edit.business.button';

const Styles = styled.div`
    .adminMenu {
        width: 100%;
        padding: 0.5rem 0;
        border: 1px solid yellow;

        /* @media (min-width: 500px) {
            align-self: flex-end;
        } */
    }

    .adminButtonWrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 5px;

        @media (min-width: 380px) {
            gap: 10px;
        }
    }

    .hideError {
        display: none;
    }
`;

const BusinessAdminMenu = ({ business, business_role }) => {

    let navigate = useNavigate()
    

    return (
        <Styles>
            <div className='adminMenu'>
                <div className='adminButtonWrapper'>
                    
                    <button onClick={() => navigate(`/business/roles/${business.id}`)}>
                        <UsersGroupIcon />
                    </button>
                    
                    {
                        (business_role > process.env.REACT_APP_MANAGER_ACCOUNT) &&
                            <ActiveBusinessToggle business_id={business.id} active_business={business.active_business} />
                    }

                    <RequestStatusToggle business_id={business.id} request_status={business.business_request_open} />

                    {
                        (business_role > process.env.REACT_APP_MANAGER_ACCOUNT) &&
                            <DeleteBusiness business_id={business.id} business_name={business.business_name}/>
                    }

                    {
                        (business_role >= process.env.REACT_APP_MANAGER_ACCOUNT) &&
                         <EditBusinessButton business={business} />
                    }

                </div>
                <div className={`errormessage ${(business.active_business) ? 'hideError' : ''}`}>* Business is inactive / does not show in search</div>
                <div className={`errormessage ${(business.business_request_open) ? 'hideError' : ''}`}>* Business currently not accepting 'Creator' request</div>
            </div>
        </Styles>
    )
}

export default BusinessAdminMenu;