import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdVerified, MdOutlineVerified } from 'react-icons/md';

import useNotification from '../../../hooks/useNotification';
import AxiosInstance from '../../../helpers/axios';
import squirrel_master from '../../../assets/squirrel-master.webp';
import LoadingSpinner from '../../loadingSpinner';

const ModUsersStyles = styled.div`
    .modUsersWrapper {
        padding: 2rem 1rem;
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
        height: 3rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
    }
`;

const ModUsers = () => {
    const [ users, setUsers ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const { dispatch } = useNotification()

    let navigate = useNavigate();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await AxiosInstance.get('/users');
                setUsers(response.data);
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
    }, [dispatch, navigate])

    if (loading) {
        return <LoadingSpinner />
    }

    console.log(users)
    return (
        <ModUsersStyles>
            <div className='modUsersWrapper'>
                <div className='modUsersHeader'>
                    <div className='subheaderText'>Users Mod Section</div>
                    <img onClick={() => navigate('/squirrelmaster')} src={squirrel_master} alt='squirrel' />
                </div>
                {
                    (users.length !== 0)
                        ? <div className='modUsersTable'>
                            {
                                users.map(user => {
                                    return (
                                        <div key={user.id} className='singleUser'>
                                            <div>{user.username}</div>
                                            <div>{user.email}{user.email_verified ? <MdVerified /> : <MdOutlineVerified />}</div>
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