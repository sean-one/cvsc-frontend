import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const rightSlideIn = keyframes`
    from {
        margin-left: -120%;
    }
    
    to {
        margin-left: 0;
    }
`;

const leftSlideOut = keyframes`
    from {
        margin-left: 0;
    }

    to {
        margin-left: -120%;
    }
`;

const NotificationStyles = styled.div`
    .notificationToast {
        min-height: 5rem;
        position: fixed;
        top: calc(var(--header-height) + 0.5rem);
        left: 0;
        background-color: var(--notification-background);
        padding: 0.75rem 2.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 0.6rem 1.2rem rgba(0,0,0,0.1);
        animation: ${rightSlideIn} 1s;
        animation-fill-mode: forwards;
    }

    .progressBar {
        height: 0.375rem;
        margin-top: 0.5rem;
        background-color: currentColor;
    }
    
    .success {
        background-color: var(--main-color);
    }

    .error {
        background-color: var(--error-color);
    }

    .exit {
        animation: ${leftSlideOut} 1s;
        animation-fill-mode: forwards;
    }

    .notification-actions {
        display: flex;
        justify-content: center;
        margin-top: 0.75rem;
        gap: 1.5rem;
    }

    .notification-actions button {
        background-color: white;
        color: black;
        border: none;
        border-radius: 0.375rem;
        padding: 0.25rem 0.75rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .notification-actions button:hover {
        background-color: #eee;
    }

`;


const Notification = ({ dispatch, id: notification_id, message, notification_type, actions}) => {
    const [ exit, setExit ] = useState(false)
    const [ width, setWidth ] = useState(0)
    const [ intervalID, setIntervalID ] = useState(null)

    const startTimer = () => {
        const id = setInterval(() => {
            setWidth((prev) => {
                if(prev < 100) {
                    return prev + 1
                }

                clearInterval(id);
                return prev
            })
        }, 20)

        setIntervalID(id)
    }

    const pauseTimer = () => {
        clearInterval(intervalID)
    }

    const closeNotification = () => {
        pauseTimer()
        setExit(true)
        setTimeout(() => {
            dispatch({
                type: "REMOVE_NOTIFICATION",
                id: notification_id
            })
        }, 750)
    }

    useEffect(() => {
        if (width === 100) {
            closeNotification()
        }
        // eslint-disable-next-line
    }, [width])

    useEffect(() => {
        if (!actions || actions.length === 0) {
            startTimer()
        }
    }, [actions])

    return(
        <NotificationStyles>
            <div onMouseEnter={pauseTimer} onMouseLeave={() => !actions?.length && startTimer()} className={`notificationToast ${exit ? 'exit' : ''}`}>
                {message}
                {actions && actions.length > 0 && (
                    <div className="notification-actions">
                        {actions.map(({ label, onClick }) => (
                            <button key={label} onClick={() => {
                                onClick(); // user-defined logic
                                closeNotification(); // remove toast
                            }}>
                                {label}
                            </button>
                        ))}
                    </div>
                )}
                {!actions?.length && (
                    <div className={`progressBar ${notification_type === 'SUCCESS' ? 'success' : 'error'}`} style={{ width: `${width}%` }} />
                )}
            </div>
        </NotificationStyles>
    )
}

export default Notification;