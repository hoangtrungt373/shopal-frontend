import {AbstractModel} from "./AbstractModel";
import {Enterprise} from "./Enterprise";

export interface ProductPoint extends AbstractModel {
    enterprise: Enterprise;
    pointExchange: number;
    pointName: string;
}
