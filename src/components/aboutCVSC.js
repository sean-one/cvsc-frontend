import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaX } from 'react-icons/fa6';
import styled from 'styled-components';


const AboutCVSCStyles = styled.div`
    .aboutWrapper {
        height: 100vh;
        width: 100vw;
        position: absolute;
        top: 0;
        left: 0;
        padding: 2rem 1rem;
        background: var(--main-background-color);
        z-index: 100;
    }
    
    .aboutContainer {
        width: 100%;
        height: 100%;
        /* border: 0.1rem solid red; */
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .missionClose {
        padding: 1rem 2rem;
        text-align: right;
        /* border: 1px solid yellow; */
    }

    .missionContainer {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        /* border: 1px solid blue; */
    }

    .missionHeader {
        color: var(--main-highlight-color);
        font-family: "Oswald", sans-serif;
        font-size: 2.75rem;
        font-weight: 400;
        text-transform: uppercase;
    }

    .missionText {
        font-family: "Nunito", sans-serif;
        font-weight: 300;
        font-style: italic;
        line-height: 1.4;
        letter-spacing: 0.08rem;
        padding: 0 1rem;
        margin: 0.75rem 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
    }
`

const AboutCVSC = ({ onClose }) => {
    let navigate = useNavigate()

    const handleMissionRegister = () => {
        localStorage.setItem('missionShown', 'true')
        navigate('/register')
    }

    const handleMissionDiscord = (appUrl, fallbackUrl) => {
        localStorage.setItem('missionShown', 'true')
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
        <AboutCVSCStyles>
            <div className='aboutWrapper'>
                <div className='aboutContainer'>
                    <div className='missionClose'>
                        <FaX  onClick={onClose} className='navBarIcons' style={{ color: `var(--error-color)` }} />
                    </div>
                    <div className='missionContainer'>
                        <div className='missionHeader'>Coachella Valley Smokers Club</div>
                        <div className='missionText'>
                            <p>This is our spot. A place for people who genuinely care about the culture—about good flower, good people, and what’s happening in the desert. Whether we’re sharing our favorite strains, dropping the best dispensary deals, or just talking about our 4:20 rituals—this is where it all comes together.</p>

                            <p>We’re building a real community around cannabis in the Coachella Valley. The calendar is where we find the events. The Discord is where we connect. So create an account, join the convo, and if your favorite shop isn’t posting yet—let them know to pull up and add their events. This whole thing works best when <span>everyone</span> tap in.</p>
                        </div>
                        <div className='formButtonWrapper'>
                            <button onClick={handleMissionRegister} className='formButton'>Register</button>
                            <button onClick={() => handleMissionDiscord('discord://discord.gg/gNgFmpBqHG', 'https://discord.gg/gNgFmpBqHG')} className='formButton'>Discord</button>
                        </div>
                    </div>
                </div>
            </div>
        </AboutCVSCStyles>
    )
}

export default AboutCVSC;