import React, { useContext, useState } from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';

// import { SiteContext } from '../../../context/site/site.provider';
import { useBusinessQuery } from '../../../hooks/useBusinessApi';
import { UsersContext } from '../../../context/users/users.provider';
// import AxiosInstance from '../../../helpers/axios';

import BusinessLocation from '../location/businessLocation';
import EditBusinessButton from '../../editButtonModals/editBusinessButton';
import BusinessUserRoles from './businessUserRoles/businessUserRoles';
import UpcomingManagement from '../../events/upcoming/upcoming.management';

const BusinessManagement = (props) => {
    const { data: business, isLoading } = useBusinessQuery(props.location.state.business_id)
    // const business_id = props.location.state.business_id
    const { useBusinessRole } = useContext(UsersContext)
    // const { setBusinessUserRoles, useBusinessById } = useContext(SiteContext)
    // const current_business = useBusinessById(business_id)
    const user_role = useBusinessRole(props.location.state.business_id)
    // const [ loading, setLoading ] = useState(false)

    // const getBusinessRoles = useCallback(() => {
    //     setLoading(true)
    //     const token = localStorage.getItem('token')

    //     AxiosInstance.get(`/roles/business/${business_id}`, {
    //         headers: { 'Authorization': 'Bearer ' + token }
    //     })
    //         .then(current_roles => {
    //             setBusinessUserRoles(current_roles.data)
    //             setLoading(false)
    //         })
    //         .catch(err => console.log(err))
    // }, [setBusinessUserRoles, business_id])

    // useEffect(() => {
    //     getBusinessRoles()
    //     // eslint-disable-next-line
    // }, []);

    if(isLoading) {
        return <div>loading...</div>
    }

    const current_business = business.data

    return (
        <Container className='px-0'>
            <Row className='d-flex m-2 px-0'>
                <Col sm={10} className='fs-2 fw-bold'>
                    {current_business.business_name}
                </Col>
                {/* {
                    ((!loading) && (user_role.role_type === 'admin'))
                        ? <EditBusinessButton business={current_business} />
                        : null
                } */}
            </Row>
            <Row className='m-2 px-0'>
                <Col md={6} className='m-auto'>
                    <Image fluid src='https://picsum.photos/500/500' alt={current_business.business_name} />
                </Col>
                <Col md={6} className='d-flex flex-column align-items-left justify-content-start'>
                    <Row className='d-flex flex-column px-0 mt-3'>
                        <Row className='px-0 mx-0'>
                            {`Email: ${current_business.business_email}`}
                        </Row>
                        {/* dynamically add optional contact information */}
                        <Row className='px-0 mx-0'>
                            {
                                (current_business.business_phone !== null)
                                    ? `Phone: ${current_business.business_phone}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (current_business.business_instagram !== null)
                                    ? `Instagram: ${current_business.business_instagram}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (current_business.business_facebook !== null)
                                    ? `Facebook: ${current_business.business_facebook}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (current_business.business_website !== null)
                                    ? `Website: ${current_business.business_website}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (current_business.business_twitter !== null)
                                    ? `Twitter: ${current_business.business_twitter}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {`Request Open: ${current_business.business_request_open}`}
                        </Row>
                        <Row className='px-0 mx-0'>
                            {`Active Business: ${current_business.active_business}`}
                        </Row>
                        <Row className='px-0 mx-0 fs-6 lh-sm mt-2 pt-2 border-top'>
                            {current_business.business_description}
                        </Row>
                    </Row>
                </Col>
            </Row>
            {
                ((current_business.business_type !== 'brand'))
                    ? <BusinessLocation business={current_business} user_role={user_role} />
                    : null
            }
            <BusinessUserRoles business_id={current_business.id} business_role={user_role} />
            <UpcomingManagement business_id={current_business.id} business_type={current_business.role_type} role_type={user_role.role_type} />
        </Container>
    )
}

export default BusinessManagement;