import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import AxiosInstance from '../../../helpers/axios';
import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification';

const MFA_EXPIRATION_TIME = 15 * 60 * 1000; // 15 minute expiration

const MFASetUpStyles = styled.div`
    .mfaSetUpWrapper {
        padding: 2rem 1rem;
    }

    .mfaEnabled {
        background: red;
    }

    .mfaDetails {
        text-align: center;
        width: 100%;
        margin: 1rem auto 2rem;
    }
`;

const MFASetUp = () => {
    const { auth } = useAuth();
    const { dispatch } = useNotification();
    const [ qrCodeUrl, setQrCodeUrl ] = useState('')
    const [ token, setToken ] = useState('');
    const [ resetView, setResetView ] = useState(false)

    let navigate = useNavigate();

    const handleGenerateMFA = async () => {
        try {
            const response = await AxiosInstance.get('/auth/generate-mfa');
            setQrCodeUrl(response.data.qrCodeUrl);
        } catch (error) {
            console.error('Error generating MFA: ', error)
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })
        }
    }

    const handleVerifyToken = useCallback(async () => {
        try {
            const response = await AxiosInstance.post('/auth/verify-mfa', { tempToken: token });

            if (response.status === 201) {
                const expiration = new Date().getTime() + MFA_EXPIRATION_TIME;
                localStorage.setItem('isMfaVerified', JSON.stringify({ verified: true, expiration: expiration }))
                
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: response?.data?.message
                    }
                })

                navigate('/squirrelmaster')
            }
        } catch (error) {
            console.error('Error verifying token: ', error)
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })
        }
    }, [token, dispatch, navigate])

    const resetMFAToken = async () => {
        setResetView(true)
    }

    useEffect(() => {
        if (!auth?.user?.is_superadmin) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: 'must be logged in to view'
                }
            })
    
            navigate('/profile')
        }
    }, [auth.user, dispatch, navigate])

    // event listener for enter key
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                handleVerifyToken();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [token, handleVerifyToken])


    return (
        <MFASetUpStyles>
            <div className='mfaSetUpWrapper'>
                {
                    (auth?.user?.mfa_enabled && !resetView)
                        ? <div>
                            <div className='mfaDetails'>enter validation code</div>
                            <input
                                type='text'
                                value={token}
                                onChange={e => setToken(e.target.value)}
                                placeholder='Enter the code from your app'
                            />
                            <button onClick={handleVerifyToken}>Verify Token</button>
                            <button onClick={resetMFAToken}>Reset</button>
                        </div>
                        : <div>
                            <button onClick={handleGenerateMFA}>Generate MFA</button>
                            {
                                qrCodeUrl &&
                                    <div>
                                        <img src={qrCodeUrl} alt='scan this qr code with your MFA app' />
                                        <input
                                            type='text'
                                            value={token}
                                            onChange={e => setToken(e.target.value)}
                                            placeholder='Enter the code from your app'
                                        />
                                        <button onClick={handleVerifyToken}>Verify Token</button>
                                    </div>
                            }
                        </div>
                }
            </div>
        </MFASetUpStyles>
    );
};

export default MFASetUp;