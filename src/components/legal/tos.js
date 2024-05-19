import React from 'react';
import styled from 'styled-components';


const TOSStyles = styled.div`
    .tosWrapper {
        padding: 2rem 1rem;
        background: var(--opacity);
    }

    .tosDate {
        font-size: var(--small-font);
        text-transform: uppercase;
    }

    .tosHeader {
        width: 100%;
        text-align: center;
        margin: 2rem 0 3rem;
    }

    .tosSection {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 2rem 0;
    }

    .tosSectionHeader {
        color: var(--main-highlight-color);
        font-size: var(--small-header-font);
        font-weight: bold;
        border-bottom: 0.1rem dotted var(--main-highlight-color);
    }

    .intellectualPropertySection {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .tosBullets {
        color: var(--main-highlight-color);
        margin: 1rem 3rem;
        list-style: circle;
    }

    .tosEmail {
        color: var(--main-highlight-color);
    }
`;


const TOS = () => {
    return (
        <TOSStyles>
            <div className='tosWrapper'>
                <div className='tosDate'>Effective Date: 05/17/2024</div>
                
                <div className='tosHeader headerText'>Terms of Service</div>

                <div className='tosSection'>
                    <div className='tosSectionHeader'>Introduction:</div>
                    <div>Thank you for choosing to be part of our community at Coachella Valley Smokers Club. These terms govern your use of our website and services and include important information about your legal rights.</div>
                </div>

                <div className='tosSection'>
                    <div className='tosSectionHeader'>Use of Our Service:</div>
                    <div>You agree that by accessing our site, you have read, understood, and agree to be bound by all of these terms of service. If you do not agree with all of these terms, you are expressly prohibited from using the site and must discontinue use immediately.</div>
                </div>

                <div className='tosSection'>
                    <div className='tosSectionHeader'>Accounts and Membership:</div>
                    <div>You may be required to register with our site to access certain features. You agree to keep your password confidential and will be responsible for all use of your account and password.</div>
                </div>

                <div className='tosSection'>
                    <div className='tosSectionHeader'>Intellectual Property Rights:</div>
                    <div className='intellectualPropertySection'>
                        <div>The content on Coachella Valley Smokers Club, including text, graphics, images, logos, and other material, except for content submitted by users, are owned by or licensed to us and are protected by copyright and other intellectual property laws. Unless expressly stated otherwise, these rights do not extend to any content provided by users of the site, such as business listings, reviews, comments, and images uploaded by users.</div>
                    
                        <div>Users retain all ownership rights to content they submit to the site. By submitting content to the site, users grant Coachella Valley Smokers Club a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, display, and distribute their content in connection with the site and Coachella Valley Smokers Club's related activities, such as marketing and promotional purposes.</div>
                            
                        <div>We respect the intellectual property rights of others and ask that our users do the same. Any infringement of intellectual property rights on our site is against our policies and may lead to removal of the infringing content or termination of the responsible user’s account.</div>
                    </div>
                </div>

                <div className='tosSection'>
                    <div className='tosSectionHeader'>User Representations:</div>
                    <div>By using the site, you represent and warrant that:</div>
                    <ul className='tosBullets'>
                        <li>You are at least 21 years of age, the minimum age required to access cannabis-related content in accordance with California state laws.</li>
                        <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                        <li>You are not accessing the site from any jurisdiction where the content is illegal or penalized.</li>
                        <li>You will not use the site for any illegal or unauthorized purpose.</li>
                        <li>Your use of the site will not violate any applicable law or regulation.</li>
                    </ul>
                    <div>If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the site (or any portion thereof).</div>
                </div>

                <div className='tosSection'>
                    <div className='tosSectionHeader'>UserGenerated Contributions:</div>
                    <div>The site may invite you to chat, contribute to, or participate in blogs, message boards, and other functionality and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, or distribute content and materials to us or on the site, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material.</div>
                </div>

                <div className='tosSection'>
                    <div className='tosSectionHeader'>Modifications and Interruptions:</div>
                    <div>We reserve the right to change, modify, or remove the contents of the site at any time or for any reason at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of the services without notice at any time.</div>
                </div>

                <div className='tosSection'>
                    <div className='tosSectionHeader'>Governing Law:</div>
                    <div>These terms shall be governed by and defined following the laws of California. Coachella Valley Smokers Club and yourself irrevocably consent that the courts of California shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.</div>
                </div>

                <div className='tosSection'>
                    <div className='tosSectionHeader'>Contact Us:</div>
                    <div>For any questions or concerns regarding your use of the site, please contact us at <span className='tosEmail'><a href='mailto:coachellavalleysmokersclub@gmail.com' target='_blank' rel='noreferrer'>coachellavalleysmokersclub@gmail.com</a></span>.</div>
                </div>
            </div>
        </TOSStyles>
    )
}

export default TOS;