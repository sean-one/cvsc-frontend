import styled from "styled-components";

import { Instagram, Twitter, FacebookCircle } from "@styled-icons/boxicons-logos"
// import { ToggleOff, ToggleOn } from '@styled-icons/material';
import { Phone, ToggleRight } from "@styled-icons/boxicons-solid"
import { ToggleLeft, ChevronDown, ChevronUp } from "@styled-icons/boxicons-regular";
import { Web } from "@styled-icons/foundation"
import { BuildingRetail, Edit, Delete, LocationAdd, LocationDismiss, Mail, PeopleTeam, PeopleTeamDelete, Prohibited } from "@styled-icons/fluentui-system-filled"
import { CameraAdd } from "@styled-icons/fluentui-system-regular";
import { Cannabis, Users } from "@styled-icons/fa-solid"

// used at all image upload and edit components
export const AddImageIcon = styled(CameraAdd)`color: var(--trim-color); width: var(--site-icon-size);`

// used in the contacts - both the input fields as well as on the business page
export const MailIcon = styled(Mail)`color: var(--trim-color); width: var(--site-icon-size);`
export const InstagramIcon = styled(Instagram)`color: var(--trim-color); width: var(--site-icon-size);`
export const TwitterIcon = styled(Twitter)`color: var(--trim-color); width: var(--site-icon-size);`
export const FacebookIcon = styled(FacebookCircle)`color: var(--trim-color); width: var(--site-icon-size);`
export const PhoneIcon = styled(Phone)`color: var(--trim-color); width: var(--site-icon-size);`
export const WebSiteIcon = styled(Web)`color: var(--trim-color); width: var(--site-icon-size);`

export const ToggleOnIcon = styled(ToggleRight)`color: var(--trim-color); width: 3.5rem;`
export const ToggleOffIcon = styled(ToggleLeft)`color: var(--trim-color); width: 3.5rem;`

export const ShowIcon = styled(ChevronDown)`color: var(--secondary-color); width: var(--site-icon-size);`
export const HideIcon = styled(ChevronUp)`color: var(--secondary-color); width: var(--site-icon-size);`


export const DispensaryIcon = styled(BuildingRetail)`color: var(--trim-color); width: var(--site-icon-size);`
export const AddLocationIcon = styled(LocationAdd)`color: var(--trim-color); width: var(--site-icon-size);`
export const RemoveLocationIcon = styled(LocationDismiss)`color: var(--trim-color); width: var(--site-icon-size);`
export const ClosedIcon = styled(Prohibited)`color: var(--trim-color); width: var(--site-icon-size);`
export const BrandIcon = styled(Cannabis)`color: var(--trim-color); width: var(--site-icon-size);`
export const EditIcon = styled(Edit)`color: var(--trim-color); width: var(--site-icon-size);`
export const DeleteIcon = styled(Delete)`color: var(--trim-color); width: var(--site-icon-size);`
export const UsersGroupIcon = styled(Users)`color: var(--trim-color); width: var(--site-icon-size);`
export const OpenRequestIcon = styled(PeopleTeam)`color: var(--trim-color); width: var(--site-icon-size);`
export const ClosedRequestIcon = styled(PeopleTeamDelete)`color: var(--trim-color); width: var(--site-icon-size);`