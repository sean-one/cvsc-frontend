import { useNavigate } from "react-router-dom";
import { MenuLinks } from "../menu.links";

export const EditButton = ({ name, edit_id }) => {
    let navigate = useNavigate()

    const buttonClick = () => {
        navigate(`${MenuLinks[name].link}${edit_id}`)
    }
    return (
        <div className='w-100' onClick={() => buttonClick()}>
            <div className='text-center py-2'>{MenuLinks[name].text}</div>
        </div>
    )
}