import React, { useState } from 'react';
import styled from 'styled-components';

import Role from './role';

const ManagerRoleStyles = styled.div``;

const ManagerRoles = ({ roles_list }) => {
    const [viewManagers, setViewManagers] = useState(true)

    const toggleManagers = () => {
        setViewManagers(!viewManagers)
    }


    return (
        <ManagerRoleStyles>
            <div className='rolesListWrapper'>
                <div className='rolesListHeader'>
                    <div>Managers</div>
                    <div onClick={() => toggleManagers()}>toggle</div>
                </div>
                {
                    viewManagers &&
                        <div>
                            {
                                roles_list.map(role =>
                                    <Role key={role.id} role={role} rolelist='managerlist' />
                                )
                            }
                        </div>
                }
            </div>
        </ManagerRoleStyles>
    )
}

export default ManagerRoles;