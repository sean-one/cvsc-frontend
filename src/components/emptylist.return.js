import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

import { ReactComponent as CVSCLogo } from '../assets/cvsc_sqr.svg';

const EmptyListReturnStyles = styled.div`
    .emptyListReturnWrapper {
        width: 100%;
        padding: 0 0.375rem;
        max-width: var(--max-page-width);
        display: flex;
        flex-direction: column;
    }

    .emptyListReturn {
        margin-top: 2.25rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0.75rem;
    }

    .emptyListBackgroundLogo {
        svg {
            width: 100%;
            height: auto;
            fill: var(--black-and-white);
        }
    }

    .emptyListOptions {
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