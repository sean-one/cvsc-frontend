import AxiosInstance from "../../../helpers/axios";
// import { useNavigate } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";

export const LogoutButton = ({ toggle }) => {
    const { logout_user } = useAuth()
    // let navigate = useNavigate()

    const logoutCall = async () => {
        const logoutResponse = await AxiosInstance.get('/auth/logout')

        if(logoutResponse.status === 204) {
            // localStorage.clear()
            
            toggle(false)
            
            logout_user()
            // navigate('/')
            
            // setAuth({})
        }
    }

    return (
        <div className='w-100' onClick={() => logoutCall()}>
            <div className='text-center py-2'>Logout</div>
        </div>
    )
}