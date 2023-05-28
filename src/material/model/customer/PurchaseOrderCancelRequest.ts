export interface PurchaseOrderCancelRequest {
    purchaseOrderId: number,
    cancelCode: string,
    customerId: number
}