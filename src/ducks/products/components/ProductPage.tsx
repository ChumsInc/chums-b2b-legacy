import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {loadProduct, setCartItemQuantity, setCurrentVariant} from '../actions';
import classNames from "classnames";
import SwatchSet from "./SwatchSet";
import AddToCartForm from "../../cart/components/AddToCartForm";
import Alert from "@mui/material/Alert";
import CartItemDetail from "./CartItemDetail";
import {noop} from '../../../utils/general';
import {redirect} from "react-router-dom";
import MissingTaxScheduleAlert from "../../customer/components/MissingTaxScheduleAlert";
import RequireLogin from "../../../components/RequireLogin";
import {useAppDispatch} from "../../../app/configureStore";
import {selectLoggedIn} from "../../user/selectors";
import {
    selectCurrentProduct,
    selectProductCartItem,
    selectProductLoading,
    selectProductSeasonAvailable,
    selectProductSeasonCode,
    selectSelectedProduct
} from "../selectors";
import {selectCustomerAccount} from "../../customer/selectors";
import ProductPageImage from "./ProductPageImage";
import ProductPageTitle from "./ProductPageTitle";
import ProductPageInfo from "./ProductPageInfo";
import {isCartProduct, isProduct, isSellAsVariants} from "../utils";
import {useLocation} from "react-router";
import {isBillToCustomer} from "../../../utils/typeguards";
import ProductPreSeasonAlert from "./ProductPreSeasonAlert";
import SelectCustomerAlert from "../../customer/components/SelectCustomerAlert";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2";
import VariantButtons from "./VariantButtons";
import Collapse from "@mui/material/Collapse";
import {useIsSSR} from "../../../hooks/is-server-side";
import {sendGtagEvent} from "../../../api/gtag";


const ProductPage = ({keyword}: {
    keyword: string;
}) => {
    const isSSR = useIsSSR();
    const dispatch = useAppDispatch();
    const loggedIn = useSelector(selectLoggedIn);
    const product = useSelector(selectCurrentProduct);
    const selectedProduct = useSelector(selectSelectedProduct);
    const loading = useSelector(selectProductLoading);
    const cartItem = useSelector(selectProductCartItem);
    const customerAccount = useSelector(selectCustomerAccount);
    const season_code = useSelector(selectProductSeasonCode);
    const season_available = useSelector(selectProductSeasonAvailable);
    const location = useLocation();
    const [cartMessage, setCartMessage] = useState<string | null>(null);
    const timerHandle = useRef<number>(0);

    useEffect(() => {
        dispatch(loadProduct(keyword));
    }, [keyword]);

    useEffect(() => {
        if (product) {
            sendGtagEvent('view_item', {
                items: [{
                    item_id: product.itemCode,
                    item_name: product.name,
                }]
            })
        }
    }, [product])

    useEffect(() => {
        setCartMessage(null);
    }, [cartItem]);

    useEffect(() => {
        if (isSSR) {
            return;
        }
        if (cartMessage) {
            timerHandle.current = window.setTimeout(() => {
                setCartMessage(null);
            }, 5000);
        }
        return () => {
            window.clearTimeout(timerHandle.current);
        }
    }, [cartMessage]);


    useEffect(() => {
        if (location?.state?.variant
            && isSellAsVariants(product)
            && selectedProduct?.keyword !== location.state.variant) {
            const [_variant] = product.variants.filter(v => v.product?.keyword === location.state.variant);
            if (_variant) {
                dispatch(setCurrentVariant(_variant));
            }
            redirect(location.pathname);
        }
    }, [location?.state?.variant]);


    const onChangeQuantity = (quantity: number) => {
        dispatch(setCartItemQuantity(quantity));
    }


    return (
        <Box className={classNames('product-page', {loading})}>
            <div className="product-panel">
                <Grid2 container spacing={5}>
                    <Grid2 xs={12} sx={{display: {xs: 'block', md: 'none'}}}>
                        <ProductPageTitle/>
                    </Grid2>
                    <Grid2 xs={12} md={6} lg={7}>
                        <ProductPageImage/>
                    </Grid2>
                    <Grid2 xs={12} md={6} lg={5}>
                        <Box sx={{display: {xs: 'none', md: 'block'}}}>
                            <ProductPageTitle/>
                        </Box>

                        <ProductPageInfo/>
                        <VariantButtons/>

                        <SwatchSet/>
                        {(!isCartProduct(cartItem) || !cartItem.itemCode) && !loading && (
                            <Alert severity="info">
                                Please select a color
                            </Alert>
                        )}
                        {!!selectedProduct && !selectedProduct?.availableForSale && (
                            <Alert severity="warning">
                                <span><strong>{selectedProduct?.name}</strong> is not available for sale.</span>
                            </Alert>
                        )}
                        {!selectedProduct?.season && !!selectedProduct?.dateAvailable && (
                            <Alert severity="warning">{selectedProduct.dateAvailable}</Alert>
                        )}
                        <RequireLogin>
                            <SelectCustomerAlert/>
                        </RequireLogin>
                        {!loggedIn && (
                            <Alert severity="warning" title="">
                                Please log in to see prices and availability
                            </Alert>
                        )}
                        <ProductPreSeasonAlert/>
                        <MissingTaxScheduleAlert/>
                        <RequireLogin>
                            <>
                                {isProduct(selectedProduct) && isCartProduct(cartItem)
                                    && isBillToCustomer(customerAccount) && selectedProduct.availableForSale && (
                                        <AddToCartForm quantity={cartItem?.quantity ?? 1} cartItem={cartItem}
                                                       setGlobalCart unitOfMeasure={cartItem.salesUM ?? 'EA'}
                                                       season_code={season_code} season_available={season_available}
                                                       disabled={!customerAccount?.TaxSchedule}
                                                       onChangeQuantity={onChangeQuantity} onDone={noop} comment=""
                                                       afterAddToCart={setCartMessage}/>
                                    )}
                                <Collapse in={!!cartMessage}>
                                    <Alert severity="info" onClose={() => setCartMessage(null)}>{cartMessage}</Alert>
                                </Collapse>
                                <CartItemDetail cartItem={cartItem} msrp={[selectedProduct?.msrp]}/>
                            </>
                        </RequireLogin>

                        <hr/>

                        {isProduct(product) && !!product.description && (
                            <div className="mt-3">
                                <div dangerouslySetInnerHTML={{__html: product.description}}/>
                            </div>
                        )}

                        {isProduct(product) && !!product.details && (
                            <div className="mt-3">
                                <h3>Features</h3>
                                <div dangerouslySetInnerHTML={{__html: product.details}}/>
                            </div>
                        )}

                    </Grid2>
                </Grid2>
            </div>
        </Box>
    );
}
export default ProductPage;
