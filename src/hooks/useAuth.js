import { useContext } from 'react';
import AuthContext from '../context/auth/auth.provider';

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;