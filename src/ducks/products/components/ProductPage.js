import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {
    clearProduct,
    fetchProduct,
    setCartItemQuantity,
    setColorCode,
    setCurrentVariant
} from '../../../actions/products';
import classNames from "classnames";
import VariantSelector from "./VariantSelector";
import SwatchSet from "./SwatchSet";
import AddToCartForm from "../../../components/AddToCartForm";
import Alert from "../../../common-components/Alert";
import CartItemDetail from "../../../components/CartItemDetail";
import {noop} from '../../../utils/general';
import {Link, useHistory} from "react-router-dom";
import MissingTaxScheduleAlert from "../../../components/MissingTaxScheduleAlert";
import RequireLogin from "../../../components/RequireLogin";
import {useAppDispatch} from "../../../app/configureStore";
import {selectLoggedIn} from "../../user/selectors";
import {
    selectCurrentProduct,
    selectProductCartItem,
    selectProductLoading,
    selectProductMSRP,
    selectProductSeasonAvailable,
    selectProductSeasonCode,
    selectProductSeasonDescription,
    selectSelectedProduct
} from "../selectors";
import {selectCustomerAccount} from "../../customer/selectors";
import {useLocation} from "react-router";
import ProductPageImage from "./ProductPageImage";
import ProductPageTitle from "./ProductPageTitle";
import ProductSeasonTeaser from "./ProductSeasonTeaser";
import ProductPageInfo from "./ProductPageInfo";


const mapStateToProps = ({user, products, customer, app}) => {
    const {loggedIn} = user;
    const {product, loading, selectedProduct, colorCode, msrp, salesUM, customerPrice, variantId, cartItem} = products;
    const {pricing, account} = customer;
    const {TaxSchedule} = account;
    const hasCustomer = !!account.CustomerNo;
    const {documentTitle} = app;
    if (!cartItem.additionalData) {
        cartItem.additionalData = {season: {}};
    }
    const season_active = selectedProduct.season_active;
    const season_code = selectedProduct.season_code || (cartItem.additionalData.season || {}).code;
    const season_available = selectedProduct.season_available || (cartItem.additionalData.season || {}).product_available;
    const season_description = selectedProduct.season_description || (cartItem.additionalData.season || {}).description;
    const season_teaser = selectedProduct.season_teaser || (cartItem.additionalData.season || {}).teaser;

    return {
        loggedIn,
        product,
        loading,
        selectedProduct,
        colorCode,
        msrp,
        salesUM,
        customerPrice,
        variantId,
        cartItem,
        pricing,
        hasCustomer,
        canViewAvailable: user.profile.accountType === 1,
        documentTitle,
        season_active,
        season_code,
        season_available,
        season_description,
        season_teaser,
        TaxSchedule
    }
};

const mapDispatchToProps = {
    fetchProduct,
    selectVariant: setCurrentVariant,
    selectColor: setColorCode,
    setCartItemQuantity,
    clearProduct,
};


const ProductPage = ({keyword}) => {
    const dispatch = useAppDispatch();
    const loggedIn = useSelector(selectLoggedIn);
    const product = useSelector(selectCurrentProduct);
    const selectedProduct = useSelector(selectSelectedProduct);
    const loading = useSelector(selectProductLoading);
    const msrp = useSelector(selectProductMSRP);
    const cartItem = useSelector(selectProductCartItem);
    const customerAccount = useSelector(selectCustomerAccount);
    const season_code = useSelector(selectProductSeasonCode);
    const season_available = useSelector(selectProductSeasonAvailable);
    const season_description = useSelector(selectProductSeasonDescription);
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        dispatch(fetchProduct(keyword));
    }, [keyword]);

    useEffect(() => {
        if (location?.state?.variant && product.variants && selectedProduct.keyword !== location.state.variant) {
            const [_variant] = product.variants.filter(v => v.product.keyword === location.state.variant);
            if (_variant) {
                dispatch(setCurrentVariant(_variant));
            }
            history.replace({
                pathname: location.pathname,
                state: {}
            });
        }
    }, [location?.state?.variant]);

    const onSelectColor = (colorCode) => {
        dispatch(setColorCode(colorCode));
    }

    const onChangeQuantity = (quantity) => {
        dispatch(setCartItemQuantity(quantity));
    }

    const hasCustomer = !!customerAccount?.CustomerNo;
    const {variants = []} = product;
    const {availableForSale, dateAvailable} = selectedProduct;

    return (
        <div className={classNames('product-page', {loading})}>
            <div className="product-panel">
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-7">
                        <ProductPageImage/>
                    </div>
                    <div className="col-12 col-md-6 col-lg-5">
                        <ProductPageTitle/>
                        <ProductSeasonTeaser/>
                        <ProductPageInfo/>
                        <VariantSelector/>
                        <SwatchSet/>
                        {!cartItem.itemCode && (
                            <Alert message="Please select an color" title=""/>
                        )}
                        {!availableForSale && (
                            <Alert type="alert-warning">
                                <span><strong>{selectedProduct.name}</strong> is not available for sale.</span>
                            </Alert>
                        )}
                        {!!dateAvailable && (
                            <Alert type="alert-warning">
                                <strong>{dateAvailable}</strong>
                            </Alert>
                        )}
                        {!hasCustomer && (
                            <RequireLogin>
                                <Alert type="alert-warning">
                                    <Link to="/profile">Please select a customer.</Link>
                                </Alert>
                            </RequireLogin>
                        )}
                        {!loggedIn && (
                            <Alert type="alert-warning" message="Please log in to see prices and availability"
                                   title=""/>
                        )}
                        {(
                            (!!availableForSale && !!season_code && !season_available)
                            || (!!availableForSale && !!cartItem?.additionalData?.season?.code && !cartItem?.additionalData?.season?.product_available)
                        ) && (
                            <Alert type="alert-info" title="Pre-Season Order:">
                                {season_description}
                            </Alert>
                        )}
                        <MissingTaxScheduleAlert/>
                        <RequireLogin>
                            <>
                                {!!hasCustomer && !!cartItem.itemCode && !!availableForSale && (
                                    <AddToCartForm quantity={cartItem?.quantity} itemCode={cartItem.itemCode}
                                                   setGlobalCart
                                                   season_code={season_code} season_available={season_available}
                                                   disabled={!customerAccount?.TaxSchedule}
                                                   onChangeQuantity={onChangeQuantity} onDone={noop}/>
                                )}
                                <CartItemDetail cartItem={cartItem} msrp={msrp}/>
                            </>
                        </RequireLogin>

                        <hr/>

                        {!!product.description && (
                            <div className="mt-3">
                                <div dangerouslySetInnerHTML={{__html: product.description}}/>
                            </div>
                        )}

                        {!!product.details && (
                            <div className="mt-3">
                                <h3>Features</h3>
                                <div dangerouslySetInnerHTML={{__html: product.details}}/>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductPage;
