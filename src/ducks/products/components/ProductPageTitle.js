import React from 'react';
import SizeIconList from "../../../components/SizeIconList";
import {useSelector} from "react-redux";
import {selectCurrentProduct} from "../selectors";
import DocumentTitle from "../../../components/DocumentTitle";

const ProductPageTitle = () => {
    const product = useSelector(selectCurrentProduct);
    const {name = ''} = product;

    const documentTitle = product.name + (product?.additionalData?.subtitle ? ` - ${product.additionalData.subtitle}` : '');
    const hasSubtitleRow = !!product.additionalData?.subtitle || !!product.additionalData?.size;

    return (
        <>
            <DocumentTitle documentTitle={documentTitle}/>
            <div className="product-title">
                <h1 className="product-name">{name}</h1>
                {hasSubtitleRow && (
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
                    </div>
                )}
            </div>
        </>
    )
}

export default ProductPageTitle;
