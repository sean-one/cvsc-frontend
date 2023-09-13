import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'

import Role from '../../roles/role';

const AllManagementPendingRequestStyles = styled.div`
    .managementRoleInsert {
        /* border: 1px solid red; */
        padding: 0 0.5rem;
        margin: 0.5rem 0 1rem;
    }
`;

const AllManagementPendingRequest = ({ name, roles }) => {
    const [viewPending, setViewPending] = useState(false)
    let navigate = useNavigate()
    
    const togglePending = () => {
        setViewPending(!viewPending)
    }


    return (
        <AllManagementPendingRequestStyles>
            <div className='managementRoleInsert'>
                <div className='sectionHeader sectionListHeader'>
                    <div onClick={() => navigate(`/business/${roles[0].business_id}`)}>{name}</div>
                    <div onClick={() => togglePending()}>{viewPending ? 'hide' : 'view'}</div>
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