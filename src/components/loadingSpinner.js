import React from 'react';
import { FaCannabis } from 'react-icons/fa6';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`

const LoadingSpinnerStyles = styled.div`
    .loadingContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1.125rem;
    }

    .loadingIcon {
        font-size: 4.5rem;
        color: var(--text-color);
        animation: ${spin} 2s linear infinite;
    }
`;


const LoadingSpinner = () => {
    return (
        <LoadingSpinnerStyles>
            <div className='loadingContainer'>
                <FaCannabis className='loadingIcon' />
            </div>
        </LoadingSpinnerStyles>
    )
}

export default LoadingSpinner;