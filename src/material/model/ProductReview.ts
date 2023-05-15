import {Product} from "./Product";
import {Customer} from "./Customer";
import {AbstractModel} from "./AbstractModel";

export interface ProductReview extends AbstractModel {
    product: Product,
    customer: Customer,
    rating: number,
    content: string,
    imageUrls: string[],
    amountLike: number,
    reviewDate: string
}