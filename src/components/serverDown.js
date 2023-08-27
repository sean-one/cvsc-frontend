import React from 'react';
import styled from 'styled-components';
import ServerDownImage from '../assets/server_down.webp'

const ServerDownStyles = styled.div`
    .serverDownWrapper {
        width: 100%;
        max-width: 100%;
        height: 100%;
        padding: 0 0.5rem;

        img {
            border-radius: 5px;
            width: 100%;
        }
    }

    .serverDownHeader {
        width: 100%;
        margin: 0.5rem;
        text-align: center;
        font-weight: bold;
        letter-spacing: 0.05rem;
    }
`;

const ServerDown = () => {
    return (
        <ServerDownStyles>
            <div className='serverDownWrapper'>
                <div className='serverDownHeader'>Server is down, please try again later</div>
                <img src={ServerDownImage} alt='server down' />
            </div>
        </ServerDownStyles>
    )
}

export default ServerDown;