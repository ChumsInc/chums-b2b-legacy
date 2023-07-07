import React from 'react';
import ProductImage from "../../../components/ProductImage";
import {useSelector} from "react-redux";
import {
    selectCurrentProduct,
    selectProductCartItem,
    selectProductColorCode,
    selectProductLoading,
    selectSelectedProduct
} from "../selectors";
import {parseImageFilename2} from "../../../common/image";

const ProductPageImage = () => {
    const cartItem = useSelector(selectProductCartItem);
    const loading = useSelector(selectProductLoading);
    const selectedProduct = useSelector(selectSelectedProduct);
    const colorCode = useSelector(selectProductColorCode);
    const product = useSelector(selectCurrentProduct);

    const {images = [], name = ''} = product;
    const {image, defaultColor} = selectedProduct;
    const productImage = cartItem.additionalData?.image_filename
        ?? parseImageFilename2({image, colorCode: colorCode || defaultColor});

    return (
        <ProductImage image={productImage}
                      selectedItem={cartItem.itemCode || ''}
                      loading={loading}
                      altImages={images}
                      alt={name}/>
    )
}
export default ProductPageImage;
