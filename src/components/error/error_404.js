import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Helmet } from "react-helmet";

const ErrorPageStyles = styled.div`
    .errorPageWrapper {
        padding: 4rem 1rem 2rem;
        text-align: center;
        border-radius: 0.5rem;
        background: var(--opacity);
    }

    .notFoundMessage {
        padding: 0.75rem 0;
    }

    .errorPageButton {
        max-width: 13rem;
        margin: 1rem auto;
    }
`;

export const ErrorPage = () => {
    let navigate = useNavigate()
    let location = useLocation()


    const getNotFoundText = (notFoundType) => {
        switch (notFoundType) {
            case 'event':
                return {
                    header: "Event not found",
                    message: "Check the Calendar for upcoming events",
                    link: '/',
                    buttonText: 'Calendar'
                };
            case 'business':
                return {
                    header: "Business not found",
                    message: "Check Businesses page for current business list",
                    link: '/businesses',
                    buttonText: 'Businesses'
                };
            default:
                return {
                    header: "404 Not Found",
                    message: "Unable to find that page",
                    link: '/',
                    buttonText: 'Home'
                }
        }
    }

    const notFoundText = getNotFoundText(location?.state?.notFound)

    return (
        <ErrorPageStyles>
            <Helmet>
                <title>CVSC - Error Page</title>
            </Helmet>
            <div className='errorPageWrapper'>
                <div className='headerText'>{notFoundText.header}</div>
                <div className='notFoundMessage'>{notFoundText.message}</div>
                <div className='buttonLike errorPageButton' onClick={() => navigate(notFoundText.link)}>
                    {notFoundText.buttonText}
                </div>
            </div>
        </ErrorPageStyles>
    )
}