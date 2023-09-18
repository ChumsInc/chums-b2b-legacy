import React from 'react';
import SizeIconList from "../../../components/SizeIconList";
import {useSelector} from "react-redux";
import {selectCurrentProduct} from "../selectors";
import DocumentTitle from "../../../components/DocumentTitle";
import ProductSeasonTeaser from "@/ducks/products/components/ProductSeasonTeaser";

const ProductPageTitle = () => {
    const product = useSelector(selectCurrentProduct);

    if (!product) {
        return null;
    }
    const documentTitle = product?.name + (product?.additionalData?.subtitle ? ` - ${product.additionalData.subtitle}` : '');
    return (
        <>
            <DocumentTitle documentTitle={documentTitle}/>
            <div className="product-title">
                <h1 className="product-name">{product.name}</h1>
                <div className="row g-3">
                    {!!product.additionalData?.subtitle && (
                        <div className="col-auto">
                            <h2 className="product-subtitle">{product.additionalData.subtitle || ''}</h2>
                        </div>
                    )}
                    {!!product.additionalData?.size && (
                        <div className="col-auto">
                            <SizeIconList size={product.additionalData.size}/>
                        </div>
                    )}
                    <div className="col-auto">
                        <ProductSeasonTeaser/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductPageTitle;
