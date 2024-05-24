import React from 'react';
import ProductImage from "../../../components/ProductImage";
import {useSelector} from "react-redux";
import {
    selectCurrentProduct, selectProductAltImages,
    selectProductCartItem,
    selectProductColorCode, selectProductImage,
    selectProductLoading,
    selectSelectedProduct
} from "../selectors";
import {parseImageFilename2} from "../../../common/image";

const ProductPageImage = () => {
    const cartItem = useSelector(selectProductCartItem);
    const loading = useSelector(selectProductLoading);
    const product = useSelector(selectCurrentProduct);
    const image = useSelector(selectProductImage)
    const altImages = useSelector(selectProductAltImages);

    if (!cartItem || !image || !image.filename) {
        return null;
    }

    return (
        <ProductImage image={image.filename}
                      selectedItem={image.itemCode ?? ''}
                      loading={loading}
                      altImages={altImages}
                      altText={product?.name}/>
    )
}
export default ProductPageImage;

