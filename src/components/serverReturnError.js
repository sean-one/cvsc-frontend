import React from 'react';
import styled from 'styled-components';

const ServerReturnErrorStyles = styled.div`
    .serverReturnError {
        width: 100%;
        color: var(--error-color);
        text-align: center;
        padding: 0.5rem 0;
    }
`;

const ServerReturnError = () => {
    return (
        <ServerReturnErrorStyles>
            <div className='serverReturnError'>Server Error</div>
        </ServerReturnErrorStyles>
    )
}

export default ServerReturnError;