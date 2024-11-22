import React from 'react';
import styled from 'styled-components';
import { FaInstagram, FaDiscord } from 'react-icons/fa6';

const JoinTheClubStyles = styled.div`
    .joinTheClubWrapper {
        height: 11rem;
        max-width: var(--max-section-width);
        margin: 1rem auto 1.5rem;
        padding: 1.5rem 0.75rem;
        border-radius: 0.7rem;
        border: 0.01rem solid var(--text-color);
    }

    .joinClubHeader {
        margin-bottom: 1rem;
        text-align: center;
        color: var(--main-highlight-color);
    }

    .clubIconsWrapper {
        display: flex;
        justify-content: center;
        gap: 5rem;
    }
    
    .clubIcon {
        cursor: pointer;
        font-size: 2rem;
        display: flex;
        padding: 0.75rem;
        justify-content: flex-start;
        align-items: center;
        gap: 0.5rem;
    }

    .clubIconText {
        color: var(--main-highlight-color);
    }
`;

const JoinTheClub = () => {

    const clubIconClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    return (
        <JoinTheClubStyles>
            <div className='joinTheClubWrapper'>
                <div className='joinClubHeader'>Join our Coachella Valley Smokers Club community!</div>
                <div className='clubIconsWrapper'>
                    <div className='clubIcon' onClick={() => clubIconClick('https://instagram.com/coachellavalleysmokersclub')}>
                        <FaInstagram className='siteIcons' />
                        <div className='clubIconText'>Instagram</div>
                    </div>
                    <div className='clubIcon' onClick={() => clubIconClick('https://discord.gg/gNgFmpBqHG')}>
                        <FaDiscord className='siteIcons' />
                        <div className='clubIconText'>Discord</div>
                    </div>
                </div>
            </div>
        </JoinTheClubStyles>
    );
}

export default JoinTheClub;
