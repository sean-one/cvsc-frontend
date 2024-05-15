import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import squirrel_master from '../../../assets/squirrel-master.webp';

const ModBusinessesStyles = styled.div`
    .modBusinessesWrapper {
        padding: 2rem 1rem;
        margin: 0 auto;
        max-width: var(--max-section-width);
        /* background: var(--opacity); */
    }
    
    .modBusinessesHeader {
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

const ModBusinesses = () => {
    let navigate = useNavigate();

    return (
        <ModBusinessesStyles>
            <div className='modBusinessesWrapper'>
                <div className='modBusinessesHeader'>
                    <div className='subheaderText'>Businesses Mod Section</div>
                    <img onClick={() => navigate('/squirrelmaster')} src={squirrel_master} alt='squirrel' />
                </div>
            </div>
        </ModBusinessesStyles>
    )
}

export default ModBusinesses;