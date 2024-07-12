import { systemRoles } from "../../utils/system_roles.js";


export const endPointRoles = {
    USER_ROLE: [ systemRoles.USER],
    ADMIN_ROLE: [systemRoles.ADMIN],
    USER_AND_ADMIN: [systemRoles.ADMIN, systemRoles.USER],

}