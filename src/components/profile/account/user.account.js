import React, { useState } from 'react';
import styled from 'styled-components';
import { getImageSrc } from '../../../helpers/getImageSrc';

import useAuth from '../../../hooks/useAuth';
import UserEditForm from '../../forms/user.edit.form';
import { role_types } from '../../../helpers/dataCleanUp';

const UserAccountStyles = styled.div`
    .userAccountPage {
        display: flex;
        border: 1px solid #263238;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: 0 auto;
        padding: 1.5rem 0.5rem;
        box-shadow: 5px 5px 5px var(--box-shadow-color);
        border-radius: 5px;
        
        @media (min-width: 500px) {
            flex-direction: row;
            justify-content: space-between;
            padding: 1.5rem;
        }}

    .profileImage {
        min-width: 225px;
        max-width: 275px;
        
        @media (min-width: 500px) {
            margin: 0.5rem;
            width: 40%;
        }

        canvas {
            max-width: 100%;
            border: 1px solid var(--image-border);
            display: block;
            box-shadow: 5px 5px 5px var(--main-text-color);
            border-radius: 50%;
        }
        
        img {
            width: 100%;
            border: 1px solid var(--image-border);
            display: block;
            box-shadow: 5px 5px 5px var(--main-text-color);
            border-radius: 50%;
        }}
    
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

    .accountButtons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;}

    .updateWrapper {
        display: flex;
        justify-content: space-between;
        align-content: center;}
`

const UserAccount = () => {
    const [ editView, setEditView ] = useState(false)
    const { auth } = useAuth()

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
                        </div>
                        
                        <div className='accountDetails'>

                            <div className='profileHeader'>
                                <div className='usernameHeader'>{auth?.user.username}</div>
                                <div className='accountTypeHeader'>{role_types[auth.user.account_type].type}</div>
                            </div>

                            <div className='userDetails'>
                                {
                                    (!editView) &&
                                        <div className={`m-0 ${(auth?.user?.email === null) ? 'd-none' : ''}`}>
                                            {auth?.user.email}
                                        </div>
                                }
                            </div>

                            <div className='accountButtons'>
                                {
                                    (!editView) &&
                                        <button onClick={() => setEditView(true)}>edit</button>
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