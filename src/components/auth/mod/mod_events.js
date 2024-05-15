import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import squirrel_master from '../../../assets/squirrel-master.webp';

const ModEventsStyles = styled.div`
    .modEventsWrapper {
        padding: 2rem 1rem;
        margin: 0 auto;
        max-width: var(--max-section-width);
        /* background: var(--opacity); */
    }
    
    .modEventsHeader {
        display: flex;
        align-items: center;
        justify-content: space-around;

        div {
            text-align: center;
            flex-grow: 1;
        }

        img {
            cursor: pointer;
            max-width: 5rem;
        }
    }
`;

const ModEvents = () => {
    let navigate = useNavigate();

    return (
        <ModEventsStyles>
            <div className='modEventsWrapper'>
                <div className='modEventsHeader'>
                    <div className='subheaderText'>Events Mod Section</div>
                    <img onClick={() => navigate('/squirrelmaster')} src={squirrel_master} alt='squirrel' />
                </div>
            </div>
        </ModEventsStyles>
    )
}

export default ModEvents;