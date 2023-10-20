import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { CreateEventIcon, DeleteIcon } from '../icons/siteIcons';


const CurrentUserRoleStyles = styled.div`
    .currentUserRoleWrapper {
        margin: 0.1rem 0;
        padding: 0.2rem 0.75rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-top: 1px dotted var(--main-text-color);
        border-bottom: 1px dotted var(--main-text-color);
    }

    .currentUserRoleButtonWrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 10px;
    }
`;

const CurrentUserRole = ({ role }) => {
    let navigate = useNavigate()


    return (
        <CurrentUserRoleStyles>
            <div className='currentUserRoleWrapper'>
                <div onClick={() => navigate(`/business/${role?.business_id}`)}>{role?.business_name}</div>
                <div className='currentUserRoleButtonWrapper'>
                    <CreateEventIcon />
                    {
                        (role?.role_type < process.env.REACT_APP_ADMIN_ACCOUNT) &&
                            <DeleteIcon />
                    }
                </div>
            </div>
        </CurrentUserRoleStyles>
    )
}

export default CurrentUserRole;