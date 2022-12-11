import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen } from "@fortawesome/free-solid-svg-icons"

export const EditEventButton = ({ event }) => {
    let navigate = useNavigate()

    
    return (
        <div onClick={() => navigate(`/event/edit/${event.event_id}`)}>
            <div className='text-center'>
                <FontAwesomeIcon icon={faPen} />
            </div>
        </div>
    )
}