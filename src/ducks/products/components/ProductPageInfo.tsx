import React from 'react';
import {useSelector} from "react-redux";
import {selectProductCartItem, selectProductMSRP, selectProductSalesUM, selectSelectedProduct} from "../selectors";
import numeral from "numeral";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ProductPageInfo = () => {
    const msrp = useSelector(selectProductMSRP);
    const salesUM = useSelector(selectProductSalesUM);
    const cartItem = useSelector(selectProductCartItem);
    const selectedProduct = useSelector(selectSelectedProduct);
    const itemCode = cartItem?.itemCode ?? selectedProduct?.itemCode ?? null;

    return (
        <Stack direction="row" justifyContent="space-between">
            <Box>
                <Typography variant="caption" sx={{mr: 2}} component="span">SKU</Typography>
                <Typography variant="body1" component="span" sx={{fontWeight: '600'}}>{itemCode}</Typography>
            </Box>
            <Box>
                <Typography variant="caption" sx={{mr: 2}} component="span">MSRP</Typography>
                <Typography variant="body1" component="span" sx={{fontWeight: '600'}}>
                    $ {msrp.map(price => numeral(price).format('0.00')).join(' - ')}
                    {' '}
                    ({salesUM})
                </Typography>
            </Box>
        </Stack>
    )
}

export default ProductPageInfo;
