import styled from "styled-components";

import { Instagram, Twitter, FacebookCircle } from "@styled-icons/boxicons-logos"
import { Phone } from "@styled-icons/boxicons-solid"
import { Web } from "@styled-icons/foundation"
import { BuildingRetail, Edit, Delete, Mail, PersonDelete, PeopleTeam, PeopleTeamDelete, Prohibited } from "@styled-icons/fluentui-system-filled"
import { Create } from "@styled-icons/ionicons-outline"
import { Bars, Cannabis, Users, UsersSlash } from "@styled-icons/fa-solid"

export const MailIcon = styled(Mail)`color: yellow; width: 22px;`
export const InstagramIcon = styled(Instagram)`color: purple; width: 22px;`
export const TwitterIcon = styled(Twitter)`color: blue; width: 22px;`
export const FacebookIcon = styled(FacebookCircle)`color: deepskyblue; width: 22px;`

export const PhoneIcon = styled(Phone)`color: white; width: 22px;`
export const WebSiteIcon = styled(Web)`color: red; width: 22px;`

export const DispensaryIcon = styled(BuildingRetail)`color: teal; width: 22px;`
export const ClosedIcon = styled(Prohibited)`color: red; width: 22px;`
export const BrandIcon = styled(Cannabis)`color: green; width: 22px;`

export const EditIcon = styled(Edit)`color: darkcyan; width: 22px;`
export const DeleteIcon = styled(Delete)`color: red; width: 22px;`

export const UsersGroupIcon = styled(Users)`color: aqua; width: 22px;`
export const OpenRequestIcon = styled(PeopleTeam)`color: coral; width: 22px;`
export const ClosedRequestIcon = styled(PeopleTeamDelete)`color: red; width: 22px;`