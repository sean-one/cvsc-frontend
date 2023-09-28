import styled from "styled-components";

import { Instagram, Twitter, FacebookCircle } from "@styled-icons/boxicons-logos"
import { Phone, ToggleRight, UserCheck } from "@styled-icons/boxicons-solid"
import { CalendarPlus, Edit, ToggleLeft, ChevronDown, ChevronUp, Trash, Cog } from "@styled-icons/boxicons-regular";
import { Web } from "@styled-icons/foundation"
import { Mail } from "@styled-icons/fluentui-system-filled"
import { CameraAdd } from "@styled-icons/fluentui-system-regular";
import { Cannabis } from "@styled-icons/fa-solid"

// used at all image upload and edit components
export const AddImageIcon = styled(CameraAdd)`color: var(--trim-color); width: var(--site-icon-size);`

// used in the contacts - both the input fields as well as on the business page
export const MailIcon = styled(Mail)`color: var(--trim-color); width: var(--site-icon-size);`
export const InstagramIcon = styled(Instagram)`color: var(--trim-color); width: var(--site-icon-size);`
export const TwitterIcon = styled(Twitter)`color: var(--trim-color); width: var(--site-icon-size);`
export const FacebookIcon = styled(FacebookCircle)`color: var(--trim-color); width: var(--site-icon-size);`
export const PhoneIcon = styled(Phone)`color: var(--trim-color); width: var(--site-icon-size);`
export const WebSiteIcon = styled(Web)`color: var(--trim-color); width: var(--site-icon-size);`

// used in Busines admin menu for active status and business request open toggles
export const ToggleOnIcon = styled(ToggleRight)`color: var(--secondary-color); width: 3.5rem;`
export const ToggleOffIcon = styled(ToggleLeft)`color: var(--secondary-color); width: 3.5rem;`

// used for various roles sections to show and hide
export const ShowIcon = styled(ChevronDown)`color: var(--secondary-color); width: var(--site-icon-size);`
export const HideIcon = styled(ChevronUp)`color: var(--secondary-color); width: var(--site-icon-size);`

// various delete buttons (roles, business)
export const DeleteIcon = styled(Trash)`width: var(--site-icon-size);`

export const ApproveUserIcon = styled(UserCheck)`width: var(--site-icon-size);`
export const CreateEventIcon = styled(CalendarPlus)`width: var(--site-icon-size);`

export const UserEditIcon = styled(Edit)`width: var(--site-icon-size);`

export const BusinessIcon = styled(Cannabis)`color: var(--trim-color); width: var(--site-icon-size);`
export const SettingsIcon = styled(Cog)`width: var(--site-icon-size);`

export const EditIcon = styled(Edit)`width: var(--site-icon-size);`