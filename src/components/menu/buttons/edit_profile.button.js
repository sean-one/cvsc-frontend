import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export const EditProfileButton = () => {
    let navigate = useNavigate()

    
    return (
        <div onClick={() => navigate(`/profile/edit`)}>
            <div className='text-center'>
                <FontAwesomeIcon icon={faPen} />
            </div>
        </div>
    )
}