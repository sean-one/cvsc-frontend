import React, { useState } from 'react';
import styled from 'styled-components';

import { ShowIcon, HideIcon } from '../../icons/siteIcons';
import Role from '../../roles/role';
import CurrentUserRole from '../../roles/current.user.role';

const UserRolesStyles = styled.div`
    .roleListWrapper {
        border-bottom: 1px dotted var(--secondary-color);
    }
    .adminRoleList {
        /* color: green; */
    }
    .managerRoleList {
        /* color: blue; */
    }
    .creatorRoleList {
        /* color: yellow; */
    }
`;


const UserRoles = ({ roles }) => {
    const [adminView, setAdminView] = useState(true)
    const [managerView, setManagerView] = useState(true)
    const [creatorView, setCreatorView] = useState(true)
    const [viewInactive, setViewInactive] = useState(false)
    let active_roles, inactive_roles, admin_roles, manager_roles, creator_roles = []

    if (roles) {
        active_roles = roles.filter(role => role.active_role)
        inactive_roles = roles.filter(role => !role.active_role)

        admin_roles = active_roles.filter(role => role.role_type === process.env.REACT_APP_ADMIN_ACCOUNT)
        manager_roles = active_roles.filter(role => role.role_type === process.env.REACT_APP_MANAGER_ACCOUNT)
        creator_roles = active_roles.filter(role => role.role_type === process.env.REACT_APP_CREATOR_ACCOUNT)
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
                <div>
                    {
                        (admin_roles.length > 0) &&
                            <div className='sectionContainer'>
                                <div className='sectionRowSplit'>
                                    <div>Admin Roles</div>
                                    <div onClick={() => toggleAdminList()}>{adminView ? <HideIcon /> : <ShowIcon />}</div>
                                </div>
                                {
                                    (adminView) &&
                                        admin_roles.map(role => {
                                            return <CurrentUserRole key={role.id} role={role} />
                                        })
                                }
                            </div>
                    }
                    {
                        (manager_roles.length > 0) &&
                        <div className='sectionContainer'>
                                <div className='sectionRowSplit'>
                                    <div>Manager</div>
                                    <div onClick={() => toggleManagerList()}>{managerView ? <HideIcon /> : <ShowIcon />}</div>
                                </div>
                                {
                                    (managerView) &&
                                        manager_roles.map(role => {
                                            return <CurrentUserRole key={role.id} role={role} />
                                        })
                                }
                            </div>
                    }
                    {
                        (creator_roles.length > 0) &&
                        <div className='sectionContainer'>
                                <div className='sectionRowSplit'>
                                    <div>Creator</div>
                                    <div onClick={() => toggleCreatorList()}>{creatorView ? <HideIcon /> : <ShowIcon />}</div>
                                </div>
                                {
                                    (creatorView) &&
                                        creator_roles.map(role => {
                                            return <CurrentUserRole key={role.id} role={role} />
                                        })
                                }
                            </div>
                    }
                    {/* {
                        active_roles.map(role =>
                            <Role key={role.id} role={role} rolelist='userlist' />
                        )
                    } */}
                </div>
                {/* {
                    (active_roles.length > 0) &&
                        <div className='sectionContainer'>
                            <div className='sectionRowSplit'>
                                <div className='subheaderText'>Current Roles</div>
                                <div onClick={() => toggleCurrent()}>{viewCurrent ? <HideIcon /> : <ShowIcon />}</div>
                            </div>
                            {
                                viewCurrent &&
                            }
                        </div>
                } */}

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
                                                <Role key={role.id} role={role} rolelist='userlist' />
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