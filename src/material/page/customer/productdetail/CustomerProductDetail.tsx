import * as React from 'react';
import {useEffect, useState} from 'react';
import {ProductDetail} from "../../../model/ProductDetail";
import {useHistory, useParams} from "react-router-dom";
import {getProductDetailApi} from "../../../service/product.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Header from "../home/Header";
import MainFeaturedPost from "../home/MainFeaturedPost";
import Grid from "@mui/material/Grid";
import FeaturedPost from "../home/FeaturedPost";
import Main from "../home/Main";
import Sidebar from "../home/Sidebar";
import Footer from "../home/Sidebar";

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
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Container maxWidth="lg">
                    <Header title="Blog" sections={sections}/>
                    <main>
                        <MainFeaturedPost post={mainFeaturedPost}/>
                        <Grid container spacing={4}>
                            {featuredPosts.map((post) => (
                                <FeaturedPost key={post.title} post={post}/>
                            ))}
                        </Grid>
                        <Grid container spacing={5} sx={{mt: 3}}>
                            <Main title="From the firehose" posts={posts}/>
                            <Sidebar
                                title={sidebar.title}
                                description={sidebar.description}
                                // archives={sidebar.archives}
                                // social={sidebar.social}
                            />
                        </Grid>
                    </main>
                </Container>
                <Footer
                    title="Footer"
                    description="Something here to give the footer a purpose!"
                />
            </ThemeProvider>
        );
    } else {
        return (
            <h1>Still loading</h1>
        );
    }
}

export default CustomerProductDetail;
