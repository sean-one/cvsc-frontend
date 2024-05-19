import React from 'react';
import styled from 'styled-components';


const PrivacyPolicyStyles = styled.div`
    .privacyPolicyWrapper {
        padding: 2rem 1rem;
        background: var(--opacity);
    }

    .privacyPolicyDate {
        font-size: var(--small-font);
        text-transform: uppercase;
    }

    .privacyPolicyHeader {
        width: 100%;
        text-align: center;
        margin: 2rem 0 3rem;
    }

    .privacyPolicySection {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 2rem 0;
    }

    .privacyPolicySectionHeader {
        color: var(--main-highlight-color);
        font-size: var(--small-header-font);
        font-weight: bold;
        border-bottom: 0.1rem dotted var(--main-highlight-color);
    }

    .informationCollected {
        color: var(--main-highlight-color);
    }
    
    .policyBullets {
        margin: 1rem 3rem;
        list-style: circle;
    }

    .privacyEmail {
        color: var(--main-highlight-color);
    }
`;

const PrivacyPolicy = () => {
    return (
        <PrivacyPolicyStyles>
            <div className='privacyPolicyWrapper'>
                <div className='privacyPolicyDate'>Effective Date: 05/17/2024</div>

                <div className='privacyPolicyHeader'>
                    <div className='headerText' style={{ color: 'var(--main-highlight-color)' }}>Coachella Valley Smokers Club</div>
                    <div>Privacy Policy</div>
                </div>

                <div className='privacyPolicySection'>
                    <div className='privacyPolicySectionHeader'>Introduction:</div>
                    <div>Welcome to Coachella Valley Smokers Club. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</div>
                </div>

                <div className='privacyPolicySection'>
                    <div className='privacyPolicySectionHeader'>Information Collection</div>
                    <div>We collect personal information when you register, make a purchase, sign up for our newsletter, or interact with certain features of our website.</div>
                    <div className='informationCollected'>
                        Types of information collected may include:
                        <ul className='policyBullets'>
                            <li>Name</li>
                            <li>Email address</li>
                        </ul>
                    </div>
                </div>

                <div className='privacyPolicySection'>
                    <div className='privacyPolicySectionHeader'>Use of Information:</div>
                    <div>The information we collect may be used in the following ways:</div>
                    <ul className='policyBullets'>
                        <li>To personalize your experience and deliver the type of content and product offerings in which you are most interested.</li>
                        <li>To improve our website in order to better serve you.</li>
                        <li>To allow us to better service you in responding to your customer service requests.</li>
                    </ul>
                </div>

                <div className='privacyPolicySection'>
                    <div className='privacyPolicySectionHeader'>Data Sharing and Disclosure:</div>
                    <div>We do not sell, trade, or rent your personally identifiable information to others. We may share generic aggregated demographic information not linked to any personal identification regarding visitors and users with our business partners, trusted affiliates, and advertisers.</div>
                </div>

                <div className='privacyPolicySection'>
                    <div className='privacyPolicySectionHeader'>Data Security:</div>
                    <div>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</div>
                </div>

                <div className='privacyPolicySection'>
                    <div className='privacyPolicySectionHeader'>User Rights:</div>
                    <div>You may request access to the personal data we hold about you, and you may request corrections or deletion of this information. For these requests, please contact us at the details below.</div>
                </div>

                <div className='privacyPolicySection'>
                    <div className='privacyPolicySectionHeader'>Changes to this Privacy Policy:</div>
                    <div>We reserve the right to make changes to this privacy policy at any time. When we do, we will post the revised policy on this page. We encourage you to frequently check this page for any changes.</div>
                </div>

                <div className='privacyPolicySection'>
                    <div className='privacyPolicySectionHeader'>Contact Us:</div>
                    <div>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at <span className='privacyEmail'><a href='mailto:coachellavalleysmokersclub.com' target="_blank" rel='noreferrer'>coachellavalleysmokersclub@gmail.com</a></span></div>
                </div>
            </div>
        </PrivacyPolicyStyles>
    )
}

export default PrivacyPolicy;