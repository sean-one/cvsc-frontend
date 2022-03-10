import { v4 } from 'uuid';


export const NOTIFICATIONS_INITIAL_STATE = [
    // {
    //     id: v4(),
    //     notification_type: "ERROR",
    //     message: 'some really really long error to test the length of the notification alert'
    // },
    // {
    //     id: v4(),
    //     notification_type: "SUCCESS",
    //     message: 'something short'
    // }
];

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