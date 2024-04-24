import React from 'react';
import {useSelector} from "react-redux";
import {selectCartItem, selectSelectedProduct} from "../selectors/products";
import Alert from "../common-components/Alert";


const ProductPreseasonAlert = () => {
    const selectedProduct = useSelector(selectSelectedProduct);
    const cartItem = useSelector(selectCartItem);
    if (!selectedProduct || !cartItem) {
        return null;
    }

    if (selectedProduct && !selectedProduct.availableForSale && !!selectedProduct.dateAvailable) {
        return (
            <Alert type="alert-info" title="Availabity: ">
                {selectedProduct. selectedProduct.dateAvailable}
            </Alert>
        )
    }

    if (selectedProduct.availableForSale
        && !!cartItem?.season
        && cartItem.season.active
        && !cartItem.additionalData.seasonAvailable) {
        return (
            <Alert type="alert-info" title="Pre-Season Order:">
                {cartItem.season?.preSeasonMessage}
            </Alert>
        )
    }
    if (!selectedProduct.availableForSale && selectedProduct.season && selectedProduct.season.active && !selectedProduct.season.product_available) {
        return (
            <Alert type="alert-warning" title="Pre-Season Order:">
                {cartItem.season?.preSeasonMessage ?? selectedProduct.season?.preSeasonMessage}
            </Alert>
        )
    }
    return null;
}

export default ProductPreseasonAlert;
