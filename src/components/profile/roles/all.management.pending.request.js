import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Role from '../../roles/role';

const AllManagementPendingRequestStyles = styled.div``;

const AllManagementPendingRequest = ({ name, roles }) => {
    const [viewPending, setViewPending] = useState(true)
    let navigate = useNavigate()
    
    const togglePending = () => {
        setViewPending(!viewPending)
    }


    return (
        <AllManagementPendingRequestStyles>
            <div className='rolesListWrapper'>
                <div className='rolesListHeader'>
                    <div onClick={() => navigate(`/business/${roles[0].business_id}`)}>{name}</div>
                    <div onClick={() => togglePending()}>toggle</div>
                </div>
                {
                    viewPending &&
                        <div>
                            {
                                roles.map(role => (
                                    <Role key={role.id} role={role} rolelist='pendinglist' />
                                ))
                            }
                        </div>
                }
            </div>
        </AllManagementPendingRequestStyles>
    )
}

export default AllManagementPendingRequest;