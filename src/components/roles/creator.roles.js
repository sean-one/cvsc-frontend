import React, { useState } from 'react';
import styled from 'styled-components';

import Role from './role';

const CreateRolesStyles = styled.div``;

const CreatorRoles = ({ roles_list }) => {
    const [viewCreators, setViewCreators] = useState(true)

    const toggleCreators = () => {
        setViewCreators(!viewCreators)
    }


    return (
        <CreateRolesStyles>
            <div className='rolesListWrapper'>
                <div className='rolesListHeader'>
                    <div>Creators</div>
                    <div onClick={() => toggleCreators()}>toggle</div>
                </div>
                {
                    viewCreators &&
                        <div>
                            {
                                roles_list.map(role =>
                                    <Role key={role.id} role={role} rolelist='creatorlist' />
                                )
                            }
                        </div>
                }
            </div>
        </CreateRolesStyles>
    )
}

export default CreatorRoles;