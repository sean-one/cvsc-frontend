import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdVerified, MdOutlineVerified } from 'react-icons/md';
import { FaTrashCan } from 'react-icons/fa6';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';
import AxiosInstance from '../../../helpers/axios';
import LoadingSpinner from '../../loadingSpinner';

const ModUsersStyles = styled.div`
    .modUsersWrapper {
        padding: 2rem 0.5rem;
        margin: 0 auto;
        max-width: var(--max-section-width);
        /* background: var(--opacity); */
    }

    .modUsersHeader {
        display: flex;
        justify-content: space-around;
        align-items: center;

        div {
            text-align: center;
            flex-grow: 1;
        }

        img {
            cursor: pointer;
            max-width: 5rem;
        }
    }

    .modUsersTable {
        padding: 1.5rem 0.5rem;
        border: 0.1rem solid var(--main-color);
    }

    .singleUser {
        padding: 1.25rem 0;
        margin: 0.3rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
        border-top: 0.05rem dotted var(--main-highlight-color);
        border-bottom: 0.05rem dotted var(--main-highlight-color);
    }

    .singleUserSection {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .singleUserLeft {
        justify-self: flex-start
        font-size: 1.7rem;
    }
    .singleUserRight {
        justify-self: flex-end
        font-size: 1.4rem;
    }
    .modUsersIcon {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const ModUsers = () => {
    const { auth } = useAuth();
    const [ users, setUsers ] = useState([]);
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ loading, setLoading ] = useState(true);
    const { dispatch } = useNotification()

    let navigate = useNavigate();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await AxiosInstance.get('/users');
                const filterMeOut = response.data.filter(user => user.id !== auth?.user?.id)
                setUsers(filterMeOut);
            } catch (error) {
                console.error('Error geting users: ', error);
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })

                if (error?.response?.data?.error?.type === 'credentials') {
                    navigate('/profile')
                }

            } finally {
                setLoading(false)
            }
        }

        getUsers();
    }, [auth.user, dispatch, navigate])

    const searchQueryUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    ) || [];

    const banUser = async (user_id) => {
        try {
            const response = await AxiosInstance.delete(`/users/squirrel-user-ban/${user_id}`)
            if (response.status === 204) {
                const update_user_list = users.filter(user => user.id !== user_id)
                setUsers(update_user_list)

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'user account has been deleted'
                    }
                })
            }
        } catch (error) {
            console.error('Error setting user ban: ', error)
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: 'there was an error banning user'
                }
            })
        }
    }

    if (loading) {
        return <LoadingSpinner />
    }


    return (
        <ModUsersStyles>
            <div className='modUsersWrapper'>
                <div className='modUsersHeader'>
                    <div className='subheaderText'>Users Mod Section</div>
                    <img onClick={() => navigate('/squirrelmaster')} src={`${process.env.PUBLIC_URL}/assets/squirrel-master.webp`} alt='squirrel' />
                </div>
                <div>
                    <input
                        type='text'
                        placeholder='search username or email'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                {
                    (users.length !== 0)
                        ? <div className='modUsersTable'>
                            {
                                searchQueryUsers.map(user => {
                                    return (
                                        <div key={user.id} className='singleUser'>
                                            <div className='singleUserSection singleUserLeft'>
                                                <div onClick={() => banUser(user.id)} className='smallSiteIcons modUsersIcon' style={{ color: 'var(--error-color)' }}><FaTrashCan /></div>
                                                <div>{user.username}</div>
                                            </div>
                                            <div className='singleUserSection singleUserRight'>
                                                <div>{user.email}</div>
                                                <div className='smallSiteIcons modUsersIcon'>{user.email_verified ? <MdVerified /> : <MdOutlineVerified />}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        : <div>no users to show</div>
                }
            </div>
        </ModUsersStyles>
    )
}

export default ModUsers;