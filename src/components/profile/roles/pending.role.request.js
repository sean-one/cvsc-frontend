import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ApproveRole from '../../roles/buttons/approve.role';
import RemoveRole from '../../roles/buttons/remove.role';

const PendingRoleRequestStyles = styled.div`
    .pendingRoleRequestWrapper {
        padding: 0.5rem 0.5rem;
        border-radius: 5px;
        box-shadow: 5px 5px 5px var(--box-shadow-color);
    }

    .pendingRole {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.25rem 0.5rem;
        border-radius: 5px;
    }

    .pendingRoleRequestHeader {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid black;
    }
    
    .pendingRoleRequestBusinessName {
        margin: 0.35rem 0;
        font-weight: bold;
        letter-spacing: 0.1rem;
    }

    .pendingUsername {
        width: 100%;
    }

    .roleButtons {
        margin-left: 0.1rem;
        display: flex;
        gap: 10px;
    }
`;

const PendingRoleRequest = ({ name, roles }) => {
    const [viewPending, setViewPending] = useState(true)
    let navigate = useNavigate()
    
    const togglePending = () => {
        setViewPending(!viewPending)
    }


    return (
        <PendingRoleRequestStyles>
            <div className='pendingRoleRequestWrapper'>
                <div className='pendingRoleRequestHeader'>
                    <div className='pendingRoleRequestBusinessName' onClick={() => navigate(`/business/${roles[0].business_id}`)}>{name}</div>
                    <div onClick={() => togglePending()}>toggle</div>
                </div>
                {
                    viewPending &&
                        <div>
                            {
                                roles.map(role => (
                                    <div key={role.id} className='pendingRole'>
                                        <div className='pendingUsername'>{role.username}</div>
                                        <div className='roleButtons'>
                                            <ApproveRole role_id={role.id} />
                                            <RemoveRole role_id={role.id} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                }
            </div>
        </PendingRoleRequestStyles>
    )
}

export default PendingRoleRequest;