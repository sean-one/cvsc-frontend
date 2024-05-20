import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import AxiosInstance from '../../../helpers/axios';
import useNotification from '../../../hooks/useNotification';
import LoadingSpinner from '../../loadingSpinner';

const ModLogsStyles = styled.div`
    .modLogsWrapper {
        padding: 2rem 1rem;
        margin: 0 auto;
        max-width: var(--max-section-width);
        /* background: var(--opacity); */
    }
    
    .modLogsHeader {
        display: flex;
        align-items: center;
        justify-content: space-around;

        div {
            text-align: center;
            flex-grow: 1;
        }

        img {
            cursor: pointer;
            max-width: 5rem;
        }
    }
`;

const ModLogs = () => {
    const [ modLogs, setModLogs ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const { dispatch } = useNotification();

    let navigate = useNavigate();

    useEffect(() => {
        const getModLogs = async () => {
            try {
                const log_response = await AxiosInstance.get('/auth/modlogs');
                setModLogs(log_response.data)

            } catch (error) {
                console.error('Error getting logs: ', error)
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })            
            } finally {
                setLoading(false)
            }
        }

        getModLogs()
    }, [dispatch])

    if (loading) {
        return <LoadingSpinner />
    }

    
    return (
        <ModLogsStyles>
            <div className='modLogsWrapper'>
                <div className='modLogsHeader'>
                    <div className='subheaderText'>Mod Logs</div>
                    <img onClick={() => navigate('/squirrelmaster')} src={`${process.env.PUBLIC_URL}/assets/squirrel-master.webp`} alt='squirrel' />
                </div>
                {
                    (modLogs.length !== 0)
                        ? <div className='modLogsTable'>
                            {
                                modLogs.map(log_line => {
                                    return (
                                        <div key={log_line.id}>
                                            {log_line.action}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        : <div>no logs to show - something went wrong</div>
                }
            </div>
        </ModLogsStyles>
    )
}

export default ModLogs;