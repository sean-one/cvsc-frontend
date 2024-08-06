import React from 'react';
import styled from 'styled-components';
import { FaInstagram, FaEnvelope, FaDiscord } from 'react-icons/fa6';
import { Helmet } from 'react-helmet';

const ContactUsStyles = styled.div`
    .contactUsWrapper {
        width: 100%;
        margin: 0 auto;
        max-width: var(--max-section-width);
    }

    .contactUsHeader {
        margin: 0.5rem 0 1.25rem;
        color: var(--main-highlight-color);
    }

    .contactSection {
        width: 100%;
        margin: 1.5rem auto;
        padding: 0 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .contactSectionHeader {
        color: var(--main-highlight-color);
    }

    .contactOption {
        padding-left: 2rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
    }

    .contactIcons {
        color: var(--main-highlight-color);
        font-size: 2.2rem;
    }

    .contactFooter {
        width: 100%;
        color: var(--main-highlight-color);
        margin-top: 3rem;
        text-align: center;
    }
`;

const openLink = (url) => {
    window.open(url, '_blank');
};

const openApp = (appUrl, fallbackUrl) => {
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


const ContactUs = () => {
    return (
        <ContactUsStyles>
            <Helmet>
                <title>CVSC - Contact</title>
            </Helmet>
            <div className='contactUsWrapper'>
                <div className='contactUsHeader headerText'>Get in Touch</div>
                <div>Have questions, need assistance, or want to discuss a potential collaboration or business opportunity?  We're here to help and would love to connect with you!</div>
                <div className='contactSection'>
                    <div className='contactSectionHeader subheaderText'>Contact Us:</div>
                    <div className='contactOption' onClick={() => openLink('mailto:CoachellaValleySmokersClub@gmail.com')}>
                        <div><FaEnvelope className='contactIcons' /></div>
                        <div><span className='boldText'>Email:</span> Send us an email.</div>
                    </div>
                    <div className='contactOption' onClick={() => openApp('instagram://user?username=CoachellaValleySmokersClub', 'https://www.instagram.com/CoachellaValleySmokersClub/')}>
                        <div><FaInstagram className='contactIcons' /></div>
                        <div><span className='boldText'>Instagram:</span> Message us on Instagram.</div>
                    </div>
                </div>
                <div className='contactSection'>
                    <div className='contactSectionHeader subheaderText'>Join Our Discord</div>
                    <div className='contactOption' onClick={() => openApp('discord://discord.gg/gNgFmpBqHG', 'https://discord.gg/gNgFmpBqHG')}>
                        <div><FaDiscord className='contactIcons' /></div>
                        <div><span className='boldText'>Community:</span> Join our Discord server to interact with other members, get real-time support or open support tickets</div>
                    </div>
                </div>
                <div className='contactFooter'>Feel free to reach out, we're always happy to hear from you and assist in any way we can!</div>
            </div>
        </ContactUsStyles>
    )
}

export default ContactUs;