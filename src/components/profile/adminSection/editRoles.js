import React, { useCallback, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import AxiosInstance from "../../../helpers/axios";

import { UsersContext } from "../../../context/users/users.provider";

import TabHeader from "../sectionComponents/tabHeader";

const EditRoles = (props) => {
    const { useBusinessRoles, setBusinessRoles } = useContext(UsersContext)
    const currentRoles = useBusinessRoles()
    const { register, handleSubmit } = useForm()

    const getCurrentRoles = useCallback(() => {
        const token = localStorage.getItem('token')
        AxiosInstance.get('/roles/current-roles', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                setBusinessRoles(response.data)
            })
            .catch(err => {
                console.log(Object.keys(err))
                console.log(err.response)
            })
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        // getCurrentRoles()
        // eslint-disable-next-line
    }, [])

    const deleteRoles = (data) => {
        const token = localStorage.getItem('token');

        AxiosInstance.delete('/roles/delete-roles', {
            headers: { 'Authorization': 'Bearer ' + token },
            data
        })
            .then(response => {
                getCurrentRoles()
            })
            .catch(err => console.log(err))

    }

    return (
        <div>
            <TabHeader title='Edit Business Roles' viewable={props.viewable} toggleView={props.toggleView} />
            <div>
                {
                    (props.viewable) &&
                    <div className='businessRoleTable'>
                        <div className='tableHeaderRow'>
                            <p>Username</p>
                            <p>Business</p>
                            <p>Role</p>
                            <p>Delete</p>
                        </div>
                        <form className='roleTable' onSubmit={handleSubmit(deleteRoles)}>
                            {
                                currentRoles.map(role => (
                                    <div className='roleTableRow' key={role.id}>
                                        <p>{role.username}</p>
                                        <p>{role.name}</p>
                                        <p>{role.role_type}</p>
                                        <input {...register(`${role.id}`)} type='radio' value={role.business_id} />
                                    </div>
                                ))
                            }
                            <input type='submit' value='delete' />
                        </form>
                    </div>
                }

            </div>
        </div>
    )
}

export default EditRoles;