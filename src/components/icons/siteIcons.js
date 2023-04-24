import styled from "styled-components";

import { Instagram, Twitter, FacebookCircle } from "@styled-icons/boxicons-logos"
import { Phone } from "@styled-icons/boxicons-solid"
import { Web } from "@styled-icons/foundation"
import { BuildingRetail, Edit, Delete, Mail, PeopleTeam, PeopleTeamDelete, Prohibited } from "@styled-icons/fluentui-system-filled"
import { CameraAdd } from "@styled-icons/fluentui-system-regular";
// import { PersonDelete } from "@styled-icons/fluentui-system-filled"
// import { Create } from "@styled-icons/ionicons-outline"
import { Cannabis, MapLocationDot, Users } from "@styled-icons/fa-solid"
// import { Bars, UsersSlash } from "@styled-icons/fa-solid"

export const MailIcon = styled(Mail)`color: var(--site-icon-color); width: var(--site-icon-size);`
export const InstagramIcon = styled(Instagram)`color: var(--site-icon-color); width: var(--site-icon-size);`
export const TwitterIcon = styled(Twitter)`color: var(--site-icon-color); width: var(--site-icon-size);`
export const FacebookIcon = styled(FacebookCircle)`color: var(--site-icon-color); width: var(--site-icon-size);`

export const PhoneIcon = styled(Phone)`color: var(--site-icon-color); width: var(--site-icon-size);`
export const WebSiteIcon = styled(Web)`color: var(--site-icon-color); width: var(--site-icon-size);`

export const DispensaryIcon = styled(BuildingRetail)`color: var(--site-icon-color); width: var(--site-icon-size);`
export const LocationIcon = styled(MapLocationDot)`color: var(--site-icon-color); width: var(--site-icon-size);`
export const ClosedIcon = styled(Prohibited)`color: var(--site-icon-color); width: var(--site-icon-size);`
export const BrandIcon = styled(Cannabis)`color: var(--site-icon-color); width: var(--site-icon-size);`

export const EditIcon = styled(Edit)`color: var(--site-icon-color); width: var(--site-icon-size);`
export const AddImageIcon = styled(CameraAdd)`color: var(--site-icon-color); width: var(--site-icon-size);`
export const DeleteIcon = styled(Delete)`color: var(--site-icon-color); width: var(--site-icon-size);`

export const UsersGroupIcon = styled(Users)`color: var(--site-icon-color); width: var(--site-icon-size);`
export const OpenRequestIcon = styled(PeopleTeam)`color: var(--site-icon-color); width: var(--site-icon-size);`
export const ClosedRequestIcon = styled(PeopleTeamDelete)`color: var(--site-icon-color); width: var(--site-icon-size);`