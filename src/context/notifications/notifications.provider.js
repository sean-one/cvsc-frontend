import React, { useReducer, createContext } from 'react';
import notificationsReducer, { NOTIFICATIONS_INITIAL_STATE } from './notifications.reducer';
import Notification from '../../components/notification';
import styled from 'styled-components'

export const NotificationsContext = createContext({
    ...NOTIFICATIONS_INITIAL_STATE
})

const Styles = styled.div`
    .notification-wrapper {
        position: fixed;
        top: 5.75rem;
        left: 0;
        z-index: 10;
    }
`;

const NotificationsProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(notificationsReducer, NOTIFICATIONS_INITIAL_STATE)

    return (
        <NotificationsContext.Provider value={{ dispatch }}>
            <Styles>
                <div className='notification-wrapper toast-container'>
                    {state.map(note => {
                        return <Notification dispatch={dispatch} key={note.id} {...note} />
                    })}
                </div>
            </Styles>
            {children}    
        </NotificationsContext.Provider>
    )
}

export default NotificationsProvider;