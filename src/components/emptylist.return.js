import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

import { ReactComponent as CVSCLogo } from '../assets/cvsc_sqr.svg';

const EmptyListReturnStyles = styled.div`
    .emptyListReturnWrapper {
        width: 100%;
        max-width: var(--max-page-width);
        height: calc(100vh - (var(--header-height) + 4rem));
    }
    
    .emptyListReturn {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .emptyListBackgroundLogo {
        width: 100%;

        svg {
            /* width: 100%; */
            fill: var(--main-color);
            /* fill: var(--black-and-white); */
        }
    }

    .emptyListOptions {
        color: var(--main-color);
        margin-top: 1.5rem;
    }
`;


const EmptyListReturn = ({ listtype }) => {
    const { isLoggedIn } = useAuth();
    let navigate = useNavigate();
    
    return (
        <EmptyListReturnStyles>
            <div className='emptyListReturnWrapper'>
                <div className='emptyListReturn'>
                    <CVSCLogo className='emptyListBackgroundLogo' />
                    <div className='emptyListOptions'>
                        {
                            isLoggedIn
                                ? <div onClick={() => navigate(`/${listtype}/create`)}>{`Create a new ${listtype}`}</div>
                                : <div onClick={() => navigate('/login')}>{`Login and create a new ${listtype}`}</div>

                        }
                    </div>
                </div>
            </div>
        </EmptyListReturnStyles>
    )
}

export default EmptyListReturn;