import {Product} from "../Product";
import {Enterprise} from "../Enterprise";

export interface AbstractAnn {
    id: number,
    productId: number,
    product: Product,
    enterpriseId: number,
    enterprise: Enterprise,
    announcementId: number,
    date: string
}