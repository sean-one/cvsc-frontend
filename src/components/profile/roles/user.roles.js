import React, { useState } from 'react';
import styled from 'styled-components';

import { ShowIcon, HideIcon } from '../../icons/siteIcons';
import UserRole from '../../roles/user.role';

const UserRolesStyles = styled.div`
    .userRolesCurrent {
    }
`;


const UserRoles = ({ roles }) => {
    const [adminView, setAdminView] = useState(false)
    const [managerView, setManagerView] = useState(false)
    const [creatorView, setCreatorView] = useState(false)
    const [viewInactive, setViewInactive] = useState(false)
    let active_roles, inactive_roles, admin_roles, manager_roles, creator_roles = []

    if (roles) {
        active_roles = roles.filter(role => role.active_role)
        inactive_roles = roles.filter(role => !role.active_role)

        admin_roles = active_roles.filter(role => role.role_type === 'admin')
        manager_roles = active_roles.filter(role => role.role_type === 'manager')
        creator_roles = active_roles.filter(role => role.role_type === 'creator')
    }

    const toggleAdminList = () => {
        setAdminView(!adminView)
    };

    const toggleManagerList = () => {
        setManagerView(!managerView)
    };

    const toggleCreatorList = () => {
        setCreatorView(!creatorView)
    };

    const toggleInactive = () => {
        setViewInactive(!viewInactive)
    };


    return (
        <UserRolesStyles>
            <div>
                <div className='userRolesCurrent'>
                    {
                        (admin_roles.length > 0) &&
                            <div className='sectionContainer'>
                                <div className='sectionRowSplit'>
                                    <div className='subheaderText'>Admin Roles</div>
                                    <div onClick={() => toggleAdminList()}>{adminView ? <HideIcon /> : <ShowIcon />}</div>
                                </div>
                                {
                                    (adminView) &&
                                        admin_roles.map(role => {
                                            return <UserRole key={role.id} role={role} />
                                        })
                                }
                            </div>
                    }
                    {
                        (manager_roles.length > 0) &&
                        <div className='sectionContainer'>
                                <div className='sectionRowSplit'>
                                    <div className='subheaderText'>Manager Roles</div>
                                    <div onClick={() => toggleManagerList()}>{managerView ? <HideIcon /> : <ShowIcon />}</div>
                                </div>
                                {
                                    (managerView) &&
                                        manager_roles.map(role => {
                                            return <UserRole key={role.id} role={role} />
                                        })
                                }
                            </div>
                    }
                    {
                        (creator_roles.length > 0) &&
                        <div className='sectionContainer'>
                                <div className='sectionRowSplit'>
                                    <div className='subheaderText'>Creator Roles</div>
                                    <div onClick={() => toggleCreatorList()}>{creatorView ? <HideIcon /> : <ShowIcon />}</div>
                                </div>
                                {
                                    (creatorView) &&
                                        creator_roles.map(role => {
                                            return <UserRole key={role.id} role={role} />
                                        })
                                }
                            </div>
                    }
                </div>
                {
                    (inactive_roles.length > 0) &&
                        <div className='sectionContainer'>
                            <div className='sectionRowSplit'>
                                <div className='subheaderText'>Inactive Roles</div>
                                <div onClick={() => toggleInactive()}>{viewInactive ? <HideIcon /> : <ShowIcon />}</div>
                            </div>
                            {
                                viewInactive &&
                                    <div>
                                        {
                                            inactive_roles.map(role =>
                                                <UserRole key={role.id} role={role} />
                                            )
                                        }
                                    </div>
                            }
                        </div>
                }
            </div>
        </UserRolesStyles>
    )
}

export default UserRoles;