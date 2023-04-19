import * as React from 'react';
import {useEffect, useState} from 'react';
import {ProductDetail} from "../../../model/ProductDetail";
import {useHistory, useParams} from "react-router-dom";
import {getProductDetailApi} from "../../../service/product.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {createTheme} from "@mui/material/styles";

interface RouteParams {
    productId: any;
}

const theme = createTheme();

const CustomerProductDetail = () => {

    const params: RouteParams = useParams()
    const [productDetail, setProductDetail] = useState<ProductDetail>();
    const history = useHistory();


    useEffect(() => {
        getProductDetailApi(params.productId)
            .then((productDetailRes: ProductDetail) => {
                setProductDetail(productDetailRes);
                console.log(productDetailRes);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
                // history.push({
                //     pathname: CustomerRouter.errorPage,
                //     state: {
                //         content: "Xin lỗi, sản phẩm bạn đang tìm kiếm không tồn tại"
                //     },
                // });
            });
    }, [params.productId]);

    if (productDetail) {
        return (
            <div>
                Product detail name = {productDetail.productName}
            </div>
        );
    } else {
        return (
            <h1>Still loading</h1>
        );
    }
}

export default CustomerProductDetail;
