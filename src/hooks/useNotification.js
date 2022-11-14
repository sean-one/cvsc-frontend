import { useContext } from 'react';
import { NotificationsContext } from '../context/notifications/notifications.provider';

const useNotification = () => {
    return useContext(NotificationsContext)
}

export default useNotification;