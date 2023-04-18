import {AbstractModel} from "./AbstractModel";

export interface AuthenticationRequest {
    email: string;
    password: string;
    description: string;
}
