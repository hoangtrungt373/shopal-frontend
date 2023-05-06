export interface CustomerPurchaseProduct {
    purchaseOrderDetailId: number;
    productId: number;
    productName: string;
    sku: string;
    mainImgUrl: string;
    mainImgText: string;
    pointExchange: number;
    amount: number;
    totalPointExchange: number;
}