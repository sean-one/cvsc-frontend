import React, { useState } from 'react';
import styled from 'styled-components';

import Role from './role';

const PendingRolesStyles = styled.div``;

const PendingRoles = ({ roles_list }) => {
    const [viewRequest, setViewRequest] = useState(true);

    const toggleRequest = () => {
        setViewRequest(!viewRequest)
    }


    return (
        <PendingRolesStyles>
            <div className='rolesListWrapper'>
                <div className='rolesListHeader'>
                    <div>Request</div>
                    <div onClick={() => toggleRequest()}>toggle</div>
                </div>
                {
                    viewRequest &&
                        <div>
                            {
                                roles_list.map(role =>
                                    <Role key={role.id} role={role} rolelist='pendinglist' />
                                )
                            }
                        </div>
                }
            </div>
        </PendingRolesStyles>
    )
}

export default PendingRoles;