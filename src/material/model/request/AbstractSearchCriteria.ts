import {UserRole} from "../enums/UserRole";

export interface AbstractSearchCriteria {
    limit?: number,
    offset?: number,
    userRole?: UserRole
}