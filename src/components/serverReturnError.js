import React from 'react';
import styled from 'styled-components';

const ServerReturnErrorStyles = styled.div`
    .serverReturnError {
        font-size: var(--small-font);
        width: 100%;
        color: var(--error-color);
        text-align: center;
        padding: 0.75rem 0;
    }
`;

const ServerReturnError = ({ return_type=null }) => {
    return (
        <ServerReturnErrorStyles>
            <div className='serverReturnError'>
                {
                    (!!return_type)
                        ? <div>{`Error returning ${return_type}`}</div>
                        : <div>Server Error</div>
                }
            </div>
        </ServerReturnErrorStyles>
    )
}

export default ServerReturnError;