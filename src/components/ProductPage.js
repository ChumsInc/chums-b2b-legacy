import React, {Component, createRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {clearProduct, fetchProduct, selectColor, selectVariant, setCartItemQuantity} from '../actions/products';
import {setDocumentTitle} from '../actions/app';
import classNames from "classnames";
import ProductImage from "./ProductImage";
import {parseImageFilename2} from '../common/image';
import ProductInfo from "./ProductInfo";
import VariantSelector from "./VariantSelector";
import SwatchSet from "./SwatchSet";
import {SELL_AS_COLOR, SELL_AS_MIX} from "../constants/actions";
import AddToCartForm from "./AddToCartForm";
import Alert from "../common-components/Alert";
import CartItemDetail from "./CartItemDetail";
import {noop} from '../utils/general';
import HelmetTitle from "./HelmetTitle";
import {Link, withRouter} from "react-router-dom";
import SeasonTeaser from "./SeasonTeaser";
import ErrorBoundary from "../common-components/ErrorBoundary";


const mapStateToProps = ({user, products, customer, app}) => {
    const {loggedIn} = user;
    const {product, loading, selectedProduct, colorCode, msrp, salesUM, customerPrice, variantId, cartItem} = products;
    const {pricing, account} = customer;
    const hasCustomer = !!account.CustomerNo;
    const {documentTitle} = app;
    if (!cartItem.additionalData) {
        cartItem.additionalData = {season: {}};
    }
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
        season_code,
        season_available,
        season_description,
        season_teaser,
    }
};

const mapDispatchToProps = {
    fetchProduct,
    selectVariant,
    selectColor,
    setCartItemQuantity,
    clearProduct,
    setDocumentTitle,
};

class ProductPage extends Component {

    static propTypes = {
        loggedIn: PropTypes.bool,
        keyword: PropTypes.string.isRequired,
        product: PropTypes.shape({
            id: PropTypes.number,
            images: PropTypes.array,
        }),
        variantId: PropTypes.number,
        selectedProduct: PropTypes.object,
        loading: PropTypes.bool,
        msrp: PropTypes.arrayOf(PropTypes.number),
        customerPrice: PropTypes.arrayOf(PropTypes.number),
        cartItem: PropTypes.shape({
            itemCode: PropTypes.string,
            quantity: PropTypes.number,
            additionalData: PropTypes.shape({
                image_filename: PropTypes.string,
                season: PropTypes.shape({
                    active: PropTypes.bool,
                    code: PropTypes.string,
                    description: PropTypes.string,
                    product_available: PropTypes.bool,
                    product_season_id: PropTypes.number,
                    product_teaser: PropTypes.string,
                })
            }),
        }),
        pricing: PropTypes.array,
        hasCustomer: PropTypes.bool,
        canViewAvailable: PropTypes.bool,
        documentTitle: PropTypes.string,
        season_code: PropTypes.string,
        season_available: PropTypes.bool,
        season_description: PropTypes.string,

        fetchProduct: PropTypes.func.isRequired,
        selectVariant: PropTypes.func.isRequired,
        selectColor: PropTypes.func.isRequired,
        setCartItemQuantity: PropTypes.func.isRequired,
        clearProduct: PropTypes.func.isRequired,
        setDocumentTitle: PropTypes.func.isRequired,
    };

    static defaultProps = {
        loggedIn: false,
        keyword: '',
        product: {
            id: 0,
            images: 0,
        },
        cartItem: {
            additionalData: {},
        },
        pricing: [],
        hasCustomer: false,
        canViewAvailable: false,
        documentTitle: '',
        season_code: null,
        season_available: false,
        season_description: '',
    };

    constructor(props) {
        super(props);
        this.onSelectVariant = this.onSelectVariant.bind(this);
        this.onSelectColor = this.onSelectColor.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.elementRef = createRef();
    }

    componentDidMount() {
        this.props.fetchProduct(this.props.keyword);
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        this.props.clearProduct();
    }


    componentDidUpdate(prevProps, prevState, snapShot) {
        const {loading, documentTitle, product, keyword, selectedProduct, location} = this.props;
        if (prevProps.keyword !== keyword) {
            this.props.fetchProduct(keyword);
            return;
        }
        if (!loading && documentTitle !== product.name) {
            this.props.setDocumentTitle(product.name);
        }

        if (location?.state?.variant) {
            const {variant} = location.state;
            if (!!variant && product.variants && selectedProduct.keyword !== variant) {
                const [_variant] = product.variants.filter(v => v.product.keyword === variant);
                if (!!_variant) {
                    this.props.selectVariant(_variant);
                }
                this.props.history.replace({
                    pathname: this.props.location.pathname,
                    state: {}
                });
            }
        }
    }

    onSelectVariant(variant) {
        const {colorCode} = this.props;
        this.props.selectVariant(variant, colorCode);
    }

    onSelectColor(colorCode) {
        this.props.selectColor(colorCode);
    }

    onChangeQuantity(quantity) {
        this.props.setCartItemQuantity(quantity);
    }


    render() {
        const {
            loggedIn, product, selectedProduct, loading, colorCode, msrp, salesUM, variantId,
            cartItem, pricing, hasCustomer, canViewAvailable, season_code, season_available, season_description,
            season_teaser,
        } = this.props;
        const {images = [], name = '', additionalData = {}, variants = []} = product;
        const {image, defaultColor, availableForSale, dateAvailable} = selectedProduct;
        const {quantity} = cartItem;

        const productImage = !!((cartItem.additionalData || {}).image_filename)
            ? cartItem.additionalData.image_filename
            : parseImageFilename2({image, colorCode: colorCode || defaultColor});
        return (
            <div className={classNames('product-page', {loading})} ref={this.elementRef}>
                <HelmetTitle title={name} description={product.description}/>
                <div className="product-panel">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-7">
                            <ProductImage image={productImage}
                                          selectedItem={cartItem.itemCode || ''}
                                          loading={loading}
                                          altImages={images}
                                          alt={name}/>
                        </div>
                        <div className="col-12 col-md-6 col-lg-5">
                            <div className="product-title">
                                <h1 className="product-name">{name}</h1>
                                <h2 className="product-subtitle">{additionalData.subtitle || ''}</h2>
                            </div>
                            {!!((cartItem?.additionalData?.season?.active && cartItem?.additionalData?.season?.product_teaser) || season_teaser) && (
                                <SeasonTeaser
                                    season_teaser={cartItem?.additionalData?.season?.product_teaser || season_teaser}/>
                            )}
                            <ProductInfo msrp={msrp} salesUM={salesUM}
                                         itemCode={cartItem.itemCode || !!selectedProduct.itemCode}
                                         upc={selectedProduct.upc}
                                         colorCode={colorCode}/>
                            {!!variants.length && (
                                <VariantSelector selectedVariantId={variantId} variants={product.variants}
                                                 onSelect={this.onSelectVariant} priceCodes={pricing}
                                                 loggedIn={loggedIn}/>
                            )}
                            {selectedProduct.sellAs === SELL_AS_MIX && !!selectedProduct.mix && (
                                <>
                                    <div>
                                        <span className="me-3">Selected Color:</span>
                                        <strong>{cartItem.colorName}</strong>
                                    </div>
                                    <SwatchSet items={selectedProduct.mix.items}
                                               swatch_format={selectedProduct.additionalData.swatch_format || '?'}
                                               sellAs={selectedProduct.sellAs} selectedColorCode={colorCode}
                                               onSelect={this.onSelectColor}/>
                                </>
                            )}
                            {selectedProduct.sellAs === SELL_AS_COLOR && !!selectedProduct.items && (
                                <>
                                    <div><span className="me-3">Color:</span><strong>{cartItem.colorName}</strong></div>
                                    <SwatchSet swatch_format={selectedProduct.additionalData.swatch_format || '?'}
                                               items={selectedProduct.items}
                                               sellAs={selectedProduct.sellAs}
                                               selectedColorCode={colorCode}
                                               onSelect={this.onSelectColor}/>
                                </>
                            )}
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
                            {loggedIn && !hasCustomer && (
                                <Alert type="alert-warning">
                                    <Link to="/profile">Please select a customer.</Link>
                                </Alert>
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
                            {!!loggedIn && !!hasCustomer && !!cartItem.itemCode && !!availableForSale && (
                                <ErrorBoundary>
                                    <AddToCartForm quantity={quantity} itemCode={cartItem.itemCode} setGlobalCart
                                                   season_code={season_code} season_available={season_available}
                                                   onChangeQuantity={this.onChangeQuantity} onDone={noop}/>
                                </ErrorBoundary>
                            )}
                            {!!loggedIn && !!cartItem.itemCode && (
                                <CartItemDetail {...cartItem} showMSRP={msrp.length > 1}
                                                canViewAvailable={canViewAvailable}/>
                            )}

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
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProductPage));
