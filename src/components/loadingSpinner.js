import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCannabis } from "@fortawesome/free-solid-svg-icons";
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
        margin-top: 0.75rem;
    }

    .loadingIcon {
        font-size: 3rem;
        color: green;
        animation: ${spin} 2s linear infinite;
    }
`;


const LoadingSpinner = () => {
    return (
        <LoadingSpinnerStyles>
            <div className='loadingContainer'>
                <FontAwesomeIcon icon={faCannabis} className='loadingIcon' spin />
            </div>
        </LoadingSpinnerStyles>
    )
}

export default LoadingSpinner;