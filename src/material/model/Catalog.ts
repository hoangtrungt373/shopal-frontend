import {AbstractModel} from "./AbstractModel";

export interface Catalog extends AbstractModel {
    name: string;
    logoUrl: string;
    description: string;
}
