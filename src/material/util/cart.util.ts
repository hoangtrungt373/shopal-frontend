import {ProductCartGroupByEnterprise} from "../model/ProductCartGroupByEnterprise";
import {ProductCart} from "../model/ProductCart";

export function groupProductCartsByEnterprise(productCarts: ProductCart[]) {
    let productCartGroupByEnterprises: ProductCartGroupByEnterprise[] = [];
    productCarts.forEach((productCart, index) => {
        let productCartGroupByEnterpriseIndex = productCartGroupByEnterprises.findIndex(x => x.enterprise.id == productCart.pointSelected.enterprise.id);
        if (productCartGroupByEnterpriseIndex != -1) {
            productCartGroupByEnterprises[productCartGroupByEnterpriseIndex].productCarts.push(productCart);
            productCartGroupByEnterprises[productCartGroupByEnterpriseIndex].orderTotal =
                productCartGroupByEnterprises[productCartGroupByEnterpriseIndex].orderTotal + productCart.pointSelected.pointExchange;
            productCartGroupByEnterprises[productCartGroupByEnterpriseIndex].amountTotal =
                productCartGroupByEnterprises[productCartGroupByEnterpriseIndex].amountTotal + productCart.amountSelected;
            console.log(productCartGroupByEnterprises);
        } else {
            let productCartGroupByEnterprise: ProductCartGroupByEnterprise = {
                enterprise: productCart.pointSelected.enterprise,
                productCarts: [productCart],
                orderTotal: productCart.pointSelected.pointExchange * productCart.amountSelected,
                amountTotal: productCart.amountSelected
            }
            productCartGroupByEnterprises.push(productCartGroupByEnterprise);
        }
    })
    return productCartGroupByEnterprises;
}