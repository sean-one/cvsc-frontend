import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import RemoveUserRole from './buttons/remove.user.role';
import ApproveRole from './buttons/approve.role';
import DowngradeRole from './buttons/downgrade.role';
import RemoveRole from './buttons/remove.role';
import UpgradeRole from './buttons/upgrade.role';

const RoleStyles = styled.div`
    .roleWrapper {
        margin: 0.1rem 0;
        padding: 0.25rem 0.75rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-top: 1px dotted var(--main-text-color);
        border-bottom: 1px dotted var(--main-text-color);
    }

    .roleButtonWrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 10px;
    }
`;


const Role = ({ role, rolelist }) => {
    let navigate = useNavigate()
    
    const role_list_buttons = {
        userlist: (
            <>
                <button disabled={!role.active_role} onClick={() => navigate('/event/create', { state: role.business_id })}>create</button>
                <RemoveUserRole role={role} />
            </>
        ),
        inactivelist: (
            <>
                <RemoveRole role_id={role.id} />
            </>
        ),
        creatorlist: (
            <>
                <UpgradeRole role_id={role.id} />
                <RemoveRole role_id={role.id} />
            </>
        ),
        managerlist: (
            <>
                <DowngradeRole role_id={role.id} />
                <RemoveRole role_id={role.id} />
            </>
        ),
        pendinglist: (
            <>
                <ApproveRole role_id={role.id} />
                <RemoveRole role_id={role.id} />
            </>
        )
    }


    return (
        <RoleStyles>
            <div className='roleWrapper'>
                {
                    (rolelist === 'userlist')
                        ? <div>{role.business_name}</div>
                        : <div>{role.username}</div>
                }
                <div className='roleButtonWrapper'>
                    {role_list_buttons[rolelist]}
                </div>
            </div>
        </RoleStyles>
    )
}

export default Role;