import React, { useState } from 'react';
import styled from 'styled-components';
import { getImageSrc } from '../../../helpers/getImageSrc';

import useAuth from '../../../hooks/useAuth';
import UserEditForm from '../../forms/user.edit.form';
import { UserEditIcon } from '../../icons/siteIcons';

const UserAccountStyles = styled.div`
    .userAccountPage {
        display: flex;
        border: 1px solid var(--trim-color);
        flex-direction: column;
        align-items: center;
        margin: 0 0.25rem;
        padding: 1.5rem 0.5rem;
        border-radius: 5px;
        
        @media (min-width: 500px) {
            flex-direction: row;
            justify-content: space-between;
        }}

    .profileImage {
        position: relative;
        min-width: 225px;
        max-width: 275px;
        
        @media (min-width: 500px) {
            margin: 0.5rem;
            width: 40%;
        }

        canvas {
            max-width: 100%;
            border: 1px solid var(--trim-color);
            display: block;
            border-radius: 50%;
        }
        
        img {
            width: 100%;
            border: 1px solid var(--trim-color);
            display: block;
            border-radius: 50%;
        }}
    
    .userEditButton {
        padding: 0.5rem;
        position: absolute;
        right: 15%;
        bottom: 0;
        border: 1px solid var(--secondary-color);
        border-radius: 50%;
        color: var(--trim-color);
        background-color: var(--main-color);
    }

    .accountDetails {
        width: 100%;
        align-self: start;
        padding-top: 1rem;
        
        @media (min-width: 500px) {
            display: flex;
            flex-direction: column;
            width: 60%;
            padding-top: 0;
            padding-left: 1rem;
            align-self: stretch;
        }}
    
    .profileHeader {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;}
    
    .usernameHeader {
        font-weight: bold;
        font-size: 1.5rem;
        align-self: flex-end;}
    
    .accountTypeHeader {
        align-self: flex-end;}

    .userDetails {
        height: 100%;}

    .updateWrapper {
        display: flex;
        justify-content: space-between;
        align-content: center;}
`

const UserAccount = () => {
    const [ editView, setEditView ] = useState(false)
    const { auth } = useAuth()

    const userRoleType = (userRoles) => {
        if (userRoles.length <= 0) return 'Basic';
        else if (userRoles.some(role => role.active_role === true && role.role_type === process.env.REACT_APP_ADMIN_ACCOUNT)) return 'Admin';
        else if (userRoles.some(role => role.active_role === true && role.role_type === process.env.REACT_APP_MANAGER_ACCOUNT)) return 'Manager';
        else if (userRoles.some(role => role.active_role === true && role.role_type === process.env.REACT_APP_CREATOR_ACCOUNT)) return 'Creator';
        else { return 'Basic' }
    }

    
    return (
        <UserAccountStyles>
            {
                !editView
                    ? <div className='userAccountPage'>
                        
                        <div className='profileImage'>
                            <img
                                src={getImageSrc(auth?.user?.avatar)}
                                alt={`user avatar`}
                            />
                            {
                                (!editView) &&
                                    <div className='userEditButton' onClick={() => setEditView(true)}><UserEditIcon /></div>
                            }
                        </div>
                        
                        <div className='accountDetails'>

                            <div className='profileHeader'>
                                <div className='usernameHeader'>{auth?.user.username}</div>
                                <div className='accountTypeHeader'>{userRoleType(auth?.roles)}</div>
                            </div>

                            <div className='userDetails'>
                                {
                                    (!editView) &&
                                        <div className={`m-0 ${(auth?.user?.email === null) ? 'd-none' : ''}`}>
                                            {auth?.user.email}
                                        </div>
                                }
                            </div>
                            
                        </div>
                    </div>
                    : <UserEditForm setEditView={setEditView} />
            }
        </UserAccountStyles>
    )
}

export default UserAccount;