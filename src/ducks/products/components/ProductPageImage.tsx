import React from 'react';
import ProductImage from "../../../components/ProductImage";
import {useSelector} from "react-redux";
import {
    selectCurrentProduct,
    selectProductCartItem,
    selectProductColorCode, selectProductImage,
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
    const image = useSelector(selectProductImage)

    if (!cartItem || !image) {
        return null;
    }

    // const productImage = cartItem?.additionalData?.image_filename
    //     ?? parseImageFilename2({image, colorCode: colorCode || defaultColor});
    const productImage = parseImageFilename2({image: selectedProduct?.image, colorCode: colorCode || selectedProduct?.defaultColor});

    return (
        <ProductImage image={image}
                      selectedItem={cartItem.itemCode || ''}
                      loading={loading}
                      altImages={product?.images}
                      altText={product?.name}/>
    )
}
export default ProductPageImage;

