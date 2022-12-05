import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen } from "@fortawesome/free-solid-svg-icons"

export const EditEventButton = ({ event }) => {
    let navigate = useNavigate()
    
    const buttonClick = () => {
        navigate(`/events/edit/${event.event_id}`)
    }

    
    return (
        <div onClick={() => buttonClick()}>
            <div className='text-center'>
                <FontAwesomeIcon icon={faPen} />
            </div>
        </div>
    )
}