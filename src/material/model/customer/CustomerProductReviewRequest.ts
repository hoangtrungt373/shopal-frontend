export interface CustomerProductReviewRequest {
    purchaseOrderDetailId: number,
    content?: string,
    rating: number,
    imgUrls?: any[]
}