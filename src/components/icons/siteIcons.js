import styled from "styled-components";

import { Instagram, Twitter, FacebookCircle } from "@styled-icons/boxicons-logos"
import { Phone, ToggleRight, UserCheck, Map, User } from "@styled-icons/boxicons-solid"
import { Web } from "@styled-icons/foundation"
import { Mail, LocationOff } from "@styled-icons/fluentui-system-filled"
import { Edit, CameraAdd, Settings, CalendarAdd, CheckmarkCircle } from "@styled-icons/fluentui-system-regular";
import { Cannabis, Xmark } from "@styled-icons/fa-solid"
import {
    ArrowToTop,
    CalendarEvent,
    // CalendarPlus,
    // Edit,
    ErrorCircle,
    Filter,
    ToggleLeft,
    ChevronDown,
    ChevronUp,
    Trash,
    Time,
    // Cog,
    MinusCircle,
    Search,
} from "@styled-icons/boxicons-regular";

// used at all image upload and edit components
export const AddImageIcon = styled(CameraAdd)`color: var(--main-color); width: var(--site-icon-size);`

export const SearchIcon = styled(Search)`width: var(--site-icon-size);`
export const FilterTopIcon = styled(ArrowToTop)`width: var(--site-icon-size);`
export const FilterIcon = styled(Filter)`width: var(--site-icon-size);`
export const CloseIcon = styled(Xmark)`width: var(--site-icon-size);`

export const AddressIcon = styled(Map)`width: var(--site-icon-size);`
export const RemoveAddressIcon = styled(LocationOff)`width: var(--site-icon-size);`
export const DateIcon = styled(CalendarEvent)`width: var(--site-icon-size);`
export const TimeIcon = styled(Time)`width: var(--site-icon-size);`

// used in the contacts - both the input fields as well as on the business page
export const MailIcon = styled(Mail)`width: var(--contact-icon-size);`
export const InstagramIcon = styled(Instagram)`width: var(--contact-icon-size);`
export const TwitterIcon = styled(Twitter)`width: var(--contact-icon-size);`
export const FacebookIcon = styled(FacebookCircle)`width: var(--contact-icon-size);`
export const PhoneIcon = styled(Phone)`width: var(--contact-icon-size);`
export const WebSiteIcon = styled(Web)`width: var(--contact-icon-size);`

// used in Busines admin menu for active status and business request open toggles
export const ToggleOnIcon = styled(ToggleRight)`color: var(--secondary-color); width: 4.75rem;`
export const ToggleOffIcon = styled(ToggleLeft)`color: var(--secondary-color); width: 4.75rem;`

// used for various roles sections to show and hide
export const ShowIcon = styled(ChevronDown)`color: var(--secondary-color); width: var(--site-icon-size);`
export const HideIcon = styled(ChevronUp)`color: var(--secondary-color); width: var(--site-icon-size);`

// various delete buttons (roles, business)
export const DeleteIcon = styled(Trash)`color: var(--error-color); width: var(--site-icon-size);`

// export const UserIcon = styled(User)`width: var(--site-icon-size);`
export const SmallUserIcon = styled(User)`width: 0.9rem;`
export const ApproveUserIcon = styled(UserCheck)`width: var(--site-icon-size);`
export const CreateEventIcon = styled(CalendarAdd)`color: var(--trim-color); width: var(--site-icon-size);`

export const ApproveIcon = styled(CheckmarkCircle)`color: var(--trim-color); width: var(--site-icon-size);`

export const UserEditIcon = styled(Edit)`width: var(--site-icon-size);`

export const BusinessIcon = styled(Cannabis)`color: var(--trim-color); width: var(--site-icon-size);`
export const SettingsIcon = styled(Settings)`width: var(--site-icon-size);`
export const InactiveBusiness = styled(ErrorCircle)`color: var(--error-color); width: var(--site-icon-size);`
export const RemoveBusinessIcon = styled(MinusCircle)`color: var(--error-color); width: var(--site-icon-size);`

export const EditIcon = styled(Edit)`color: #F4F6F5; width: var(--site-icon-size);`
export const SmallEditIcon = styled(Edit)`color: #F4F6F5; width: 1.2rem;`