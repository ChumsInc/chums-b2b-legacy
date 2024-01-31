import React from 'react';
import SizeIconList from "../../../components/SizeIconList";
import {useSelector} from "react-redux";
import {selectCurrentProduct} from "../selectors";
import DocumentTitle from "../../../components/DocumentTitle";
import ProductSeasonTeaser from "./ProductSeasonTeaser";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Unstable_Grid2";

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
                <Typography component="h1" variant="h1">{product.name}</Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                    {!!product.additionalData?.subtitle && (
                        <Typography component="h2" variant="h2">
                            {product.additionalData.subtitle || ''}
                        </Typography>
                    )}
                    {!!product.additionalData?.size && (
                        <SizeIconList size={product.additionalData.size}/>
                    )}
                </Stack>
                <ProductSeasonTeaser/>
            </div>
        </>
    )
}

export default ProductPageTitle;
