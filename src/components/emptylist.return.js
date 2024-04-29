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

    .emptyListOptions {
        color: var(--text-color);
        margin-top: 1.5rem;
        cursor: pointer;
    }
`;


const EmptyListReturn = ({ listtype }) => {
    const { isLoggedIn } = useAuth();
    let navigate = useNavigate();
    
    return (
        <EmptyListReturnStyles>
            <div className='emptyListReturnWrapper'>
                <div className='emptyListReturn'>
                    <CVSCLogo />
                    <div className='emptyListOptions'>
                        {
                            isLoggedIn
                                ? <p onClick={() => navigate(`/${listtype}/create`)}>{`Create a new ${listtype}`}</p>
                                : <p onClick={() => navigate('/login')}>{`Login and create a new ${listtype}`}</p>

                        }
                    </div>
                </div>
            </div>
        </EmptyListReturnStyles>
    )
}

export default EmptyListReturn;