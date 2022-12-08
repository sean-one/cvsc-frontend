import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { useEventImageUpdateMutation } from '../../../hooks/useEvents';

const UpdateEventImage = ({ event_id }) => {
    const [ imageFile, setImageFile ] = useState('')
    const [ modalShow, setModalShow ] = useState(false)
    const { mutateAsync: updateEventImageMutation } = useEventImageUpdateMutation()

    const { register, handleSubmit, clearErrors, formState:{ errors } } = useForm({
        mode: 'onBlur'
    })

    const updateImage = async (data) => {
        // console.log(data['eventmedia'][0])
        // console.log(imageFile)
        const formData = new FormData()
        formData.set('eventmedia', imageFile)
        
        const update_image = await updateEventImageMutation({ ...formData, event_id })

        console.log(update_image)
        return
    }

    const handleModalOpen = () => setModalShow(true)
    const handleModalClose = () => setModalShow(false)
    

    return (
        <div className='position-absolute bottom-0 end-0 bg-light rounded-circle border border-light'>
            <FontAwesomeIcon
                onClick={handleModalOpen}
                icon={faPlusCircle}
                size='3x'
            />
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(updateImage)} encType='multipart/form-data' className='gy3'>
                        <Form.Group controlId='eventmedia' className='my-3'>
                            <Form.Control
                                {...register('eventmedia')}
                                onFocus={() => clearErrors('eventmedia')}
                                type='file'
                                name='eventmedia'
                                accept='image/*'
                                onChange={(e) => setImageFile(e.target.files[0])}
                                required
                            />
                            <div className='errormessage'>{errors.eventmedia?.message}</div>
                        </Form.Group>
                        <Button type='submit'>Upload</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default UpdateEventImage;