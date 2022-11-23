import { useNavigate } from "react-router-dom";
import { MenuLinks } from "../menu.links";

export const SimpleButton = ({ toggle, name }) => {
    let navigate = useNavigate()

    const buttonClick = () => {
        toggle(false)
        navigate(MenuLinks[`${name}`].link)

    }

    return (
        <div className='w-100' onClick={() => buttonClick()}>
            <div className='text-center py-2'>{MenuLinks[`${name}`].text}</div> 
        </div>
    )
}