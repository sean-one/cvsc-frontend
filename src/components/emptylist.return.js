import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import EventCard from '../components/events/views/event.card';
import useSampleEvent from '../hooks/useSampleEvent';

import { ReactComponent as CVSCLogo } from '../assets/cvsc_sqr.svg';

const EmptyListReturnStyles = styled.div`
    .emptyListReturnWrapper {
        width: 100%;
        max-width: var(--max-page-width);
    }
    
    .smokersClubLogo {
        width: 100%;
        max-width: var(--max-section-width);
        padding: 0 1rem;
        margin: 0 auto;
    }

    .emptyListCTA {
        width: 100%;
        margin: 1.5rem 0;
        display: flex;
        justify-content: center;
        text-align: center;
        color: var(--main-highlight-color);
    }

    .createEventAction, .loginAction {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }
`;



const EmptyListReturn = ({ listtype }) => {
    const { isLoggedIn } = useAuth();
    const { sampleEvent, sampleLoading, sampleError, sampleSuccess } = useSampleEvent();

    let navigate = useNavigate();
    

    return (
        <EmptyListReturnStyles>
            <div className='emptyListReturnWrapper'>
                {
                    (sampleSuccess && !sampleError)
                        ? <EventCard event={sampleEvent}/>
                        : <dir className='smokersClubLogo'><CVSCLogo /></dir>
                }
                <div className='emptyListCTA'>
                    {
                        isLoggedIn
                            ? <div className='createEventAction'>
                                <div>{`Add your ${listtype} to the club!`}</div>
                                <button className='formButton' onClick={() => navigate(`/${listtype}/create`)}>{`Add ${listtype}`}</button>
                            </div>
                            : <div className='loginAction'>
                                <div>{`Login and add your ${listtype} to the club`}</div>
                                <button className='formButton' onClick={() => navigate('/login')}>{`Login`}</button>
                            </div>
                    }
                </div>
            </div>
        </EmptyListReturnStyles>
    )
}

export default EmptyListReturn;