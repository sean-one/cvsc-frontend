import React, { useState, useEffect } from 'react';
import { Toast } from 'react-bootstrap';
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
        animation: ${rightSlideIn} 0.75s;
        animation-fill-mode: forwards;
    }

    .progressBar {
        height: 0.25rem;
    }
    
    .success {
        background-color: green;
    }

    .error {
        background-color: red;
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
        }, 500)
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
            <Toast onMouseEnter={pauseTimer} onMouseLeave={startTimer} className={`my-toast ${exit ? 'exit' : ''}`}>
                <Toast.Body>
                    {props.message}
                    <div className={`progressBar ${props.notification_type === 'SUCCESS' ? 'success' : 'error'}`} style={{ width: `${width}%` }} />
                </Toast.Body>
            </Toast>
        </Styles>
    )
}

export default Notification;