import React, { useState } from 'react';
import styled from 'styled-components';

import { ShowIcon, HideIcon } from '../../icons/siteIcons';
import UserRole from '../../roles/user.role';

const UserRolesStyles = styled.div`
    .userRolesWrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 1rem;
    }

    .userRolesHeader {
        margin: 1rem 0;
        color: var(--main-highlight-color);
    }
    
    .userRolesList {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        color: var(--main-color);
    }
    
    .userRolesSection {
        width: 100%;
        max-width: var(--max-section-width);
    }
    
    .userRolesSectionHeader {
        width: 100%;
        height: 6rem;
        border-radius: 0.5rem;
        color: var(--main-background-color);
        background-color: var(--main-highlight-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        margin: 0.25rem 0;

        svg {
            color: var(--main-background-color);
        }
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
            <div className='userRolesWrapper'>
                <div className='subheaderText userRolesHeader'>User Business Roles</div>
                <div className='userRolesList'>
                    {
                        (admin_roles.length > 0) &&
                            <div className='userRolesSection'>
                                <div className='userRolesSectionHeader'>
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
                        <div className='userRolesSection'>
                                <div className='userRolesSectionHeader'>
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
                        <div className='userRolesSection'>
                                <div className='userRolesSectionHeader'>
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
                        <div className='userRolesList'>
                            <div className='userRolesSection'>
                                <div className='userRolesSectionHeader'>
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
                        </div>
                }
            </div>
        </UserRolesStyles>
    )
}

export default UserRoles;