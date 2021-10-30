import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import AxiosInstance from '../../../../helpers/axios';

import { UsersContext } from "../../../../context/users/users.provider";

import { roleEditUpdate } from "../../../../helpers/dataCleanUp";

const EditRoles = (props) => {
    const { useBusinessRoles } = useContext(UsersContext)
    const currentRoles = useBusinessRoles()
    const { register, handleSubmit } = useForm()

    useEffect(() => {
        props.getRoles()
        // eslint-disable-next-line
    }, [])

    const deleteRoles = (data) => {
        const token = localStorage.getItem('token');
        const cleaned = roleEditUpdate(data)
        const roleEdits = []

        for (const roleId in cleaned) {
            
            const roleToEdit = currentRoles.filter(role => role.id === cleaned[roleId])
            roleEdits.push({ id: cleaned[roleId], business_id: roleToEdit[0].business_id })
        
        }

        AxiosInstance.delete('/roles/deleteUserRoles', {
            headers: {'Authorization': 'Bearer ' + token},
            data: roleEdits
        })
            .then(response => {
                props.getRoles()
                // console.log(response)
            })
            .catch(err => console.log(err))
        // console.log(roleEdits)

    }

    // console.log(currentRoles)
    return (
        <div>
            <div className='tabHeader'>
                <p>Edit Current Roles</p>
                {
                    (props.viewable) ?
                        <FontAwesomeIcon className='tabIcon' icon={faCaretDown} size='1x' onClick={props.toggleView} />
                        : <FontAwesomeIcon className='tabIcon' icon={faCaretLeft} size='1x' onClick={props.toggleView} />
                }
            </div>
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
                                        <p>{role.roletype}</p>
                                        <input {...register(`${role.id}`)} type='radio' value='delete' />
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