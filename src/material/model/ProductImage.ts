import {AbstractModel} from "./AbstractModel";

export interface ProductImage extends AbstractModel {
    imageUrl: string;
    isMainUrl: boolean;
}
