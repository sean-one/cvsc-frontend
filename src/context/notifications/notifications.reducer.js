import { v4 } from 'uuid';


export const NOTIFICATIONS_INITIAL_STATE = [];

const notificationsReducer = (state, action) => {
    switch(action.type) {
        case "ADD_NOTIFICATION":
            return [...state, {...action.payload, id: v4()}];
        case "REMOVE_NOTIFICATION":
            return state.filter(note => note.id !== action.id)
        default:
            throw new Error(`unhandled type: ${action.type}`)
            // return state
    }
}

export default notificationsReducer;