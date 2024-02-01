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

const Styles = styled.div`
    .my-toast {
        position: fixed;
        top: var(--header-height);
        left: 0;
        background-color: var(--form-input-background);
        padding: 0.75rem;
        border-radius: 0.75rem;
        box-shadow: 0 0.6rem 1.2rem rgba(0,0,0,0.1);
        animation: ${rightSlideIn} 0.75s;
        animation-fill-mode: forwards;
    }

    .progressBar {
        height: 0.375rem;
        background-color: currentColor;
    }
    
    .success {
        background-color: var(--main-text-color);
    }

    .error {
        background-color: var(--error-color);
    }

    .exit {
        animation: ${leftSlideOut} 0.75s;
        animation-fill-mode: forwards;
    }
`;


const Notification = (props) => {
    const [ exit, setExit ] = useState(false)
    const [ width, setWidth ] = useState(0)
    const [ intervalID, setIntervalID ] = useState(null)

    const startTimer = () => {
        const id = setInterval(() => {
            setWidth((prev) => {
                if(prev < 100) {
                    return prev + 0.5
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
            props.dispatch({
                type: "REMOVE_NOTIFICATION",
                id: props.id
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
        startTimer()
    }, [])

    return(
        <Styles>
            <div onMouseEnter={pauseTimer} onMouseLeave={startTimer} className={`my-toast ${exit ? 'exit' : ''}`}>
                {props.message}
                <div className={`progressBar ${props.notification_type === 'SUCCESS' ? 'success' : 'error'}`} style={{ width: `${width}%` }} />
            </div>
        </Styles>
    )
}

export default Notification;