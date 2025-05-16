import React from 'react';
import styled from 'styled-components';
import DiscordBanner from '../../assets/cvsc_discord.webp';
// import { FaInstagram, FaDiscord } from 'react-icons/fa6';

const CVSCDiscordStyles = styled.div`
    .CVSCDiscordWrapper {
        /* height: 11rem; */
        max-width: var(--max-section-width);
        margin: 1rem auto 1.5rem;
        /* padding: 1.5rem 0.75rem; */
        border-radius: 0.7rem;
        border: 0.01rem solid var(--text-color);
    }

    .CVSCDiscordWrapper img {
        border-radius: 0.7rem;
    }
`;

const AdCVSCDiscord = () => {

    const joinOurDiscord = (appUrl, fallbackUrl) => {
        const isMobile = /android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        if (isMobile) {
            // open app link for mobile devices
            window.location.href = appUrl;
            // fallback to web link if app is not available
            setTimeout(() => {
                window.location.href = fallbackUrl;
            }, 500);
        } else {
            // open web link for desktop devices
            window.open(fallbackUrl, '_blank');
        }
    }

    return (
        <CVSCDiscordStyles>
            <div className='CVSCDiscordWrapper' onClick={() => joinOurDiscord('discord://discord.gg/gNgFmpBqHG', 'https://discord.gg/gNgFmpBqHG')}>
                <img src={DiscordBanner} alt='join our discord community' />
            </div>
        </CVSCDiscordStyles>
    );
}

export default AdCVSCDiscord;
