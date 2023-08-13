import React from 'react';
import styled from 'styled-components';
import ServerDownImage from '../assets/server_down.webp'

const ServerDownStyles = styled.div`
    .serverDownWrapper {
        width: 100%;
        max-width: 100%;
        height: 100%;

        img {
            width: 100%;
        }
    }
`;

const ServerDown = () => {
    return (
        <ServerDownStyles>
            <div className='serverDownWrapper'>
                <img src={ServerDownImage} alt='server down' />
            </div>
        </ServerDownStyles>
    )
}

export default ServerDown;