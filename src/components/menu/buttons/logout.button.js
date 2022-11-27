import AxiosInstance from "../../../helpers/axios";
import { useNavigate } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";

export const LogoutButton = ({ toggle }) => {
    const { setAuth } = useAuth()
    let navigate = useNavigate()

    const logoutCall = async () => {
        const logoutResponse = await AxiosInstance.get('/auth/logout')

        if(logoutResponse.status === 204) {
            localStorage.clear()
            
            navigate('/')
            
            toggle(false)
            
            setAuth({})
        }
    }

    return (
        <div className='w-100' onClick={() => logoutCall()}>
            <div className='text-center py-2'>Logout</div>
        </div>
    )
}