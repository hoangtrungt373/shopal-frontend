import * as React from 'react';
import {useEffect, useState} from 'react';
import {ProductDetail} from "../../../model/ProductDetail";
import {useHistory, useParams} from "react-router-dom";
import {getProductDetailApi} from "../../../service/product.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {AssetPath} from '../../../config/router';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {ButtonGroup} from '@mui/material';
import TextField from "@mui/material/TextField";
import {isAuthenticated} from "../../../util/auth.util";

interface RouteParams {
    productId: any;
}

interface Props {
    product?: ProductDetail,
    onClickAddToCart?: Function
}

const theme = createTheme();

const ProductInfo: React.FC<Props> = ({product, onClickAddToCart}) => {

    const [amount, setAmount] = useState<number>(1);
    const [selectProductPointId, setSelectProductPointId] = useState<number>();

    return (
        <Box sx={{
            border: "1px solid black",
            display: "flex",
            flexDirection: "column",
            gap: 2,
        }}
        >
            <Typography variant="h6" align={"left"}>{product.productName}</Typography>
            <Box sx={{display: "flex", gap: 2}}>
                {/* TODO: add feature review */}
                <Typography>Danh gia: 4.5</Typography>
                {/* TODO: get purchased order amount*/}
                <Typography>500 Da ban</Typography>
            </Box>
            <Box sx={{display: "flex", gap: 2}}>
                <Typography>Danh sach diem</Typography>
                <Box sx={{display: "flex", gap: 2}}>
                    {
                        product.exchangeAblePoints.map((point, index) => (
                            <Button key={index} variant="outlined"
                                    sx={{color: point.id == selectProductPointId ? 'red' : ''}}
                                    onClick={() => {
                                        setSelectProductPointId(point.id);
                                    }}
                            >{point.enterprise.enterpriseName} {point.pointExchange} Points</Button>
                        ))
                    }
                </Box>
            </Box>
            <Box sx={{display: "flex", gap: 2}}>
                <Typography>So luong</Typography>
                <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                    <Button onClick={() => setAmount(amount > 1 ? amount - 1 : amount)}>-</Button>
                    {/* TODO: handle 0 amount */}
                    <TextField id={"amount"} type="number" value={amount}
                               onChange={event => {
                                   let newAmount = parseInt(event.target.value);
                                   if (newAmount > 0 && newAmount <= product.quantityInStock) {
                                       setAmount(newAmount)
                                   }
                               }}></TextField>
                    <Button onClick={() => setAmount(amount < product.quantityInStock ? amount + 1 : amount)}>+</Button>
                </ButtonGroup>
                <Typography>{product.quantityInStock} san pham co san</Typography>
            </Box>
            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                <Button variant="outlined" onClick={() => onClickAddToCart(amount, selectProductPointId)}>Them vao gio
                    hang</Button>
                <Button variant="contained">Mua ngay</Button>
            </Box>
        </Box>
    )
}

const CustomerProductDetailPage: React.FC<Props> = () => {

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

    const handleAddToCart = (amount, selectProductPointId) => {
        console.log(amount, selectProductPointId);
        if (isAuthenticated() && productDetail) {
        } else {
            console.log("Login please")
        }
    }

    if (productDetail) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Container maxWidth="lg">
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <div>
                                <img src={`${AssetPath.productImgUrl}${productDetail.imageUrls[0].imageUrl}`}
                                     alt={"img"}/>
                            </div>
                        </Grid>
                        <Grid item xs={7}>
                            <ProductInfo product={productDetail}
                                         onClickAddToCart={(amount: number, selectProductPointId: number) => handleAddToCart(amount, selectProductPointId)}/>
                        </Grid>
                    </Grid>
                </Container>
            </ThemeProvider>
        );
    } else {
        return (
            <h1>Still loading</h1>
        );
    }
}

export default CustomerProductDetailPage;
