import React from 'react';
import {getMSRP, getPrices, getSalesUM} from "../../../utils/products";
import numeral from 'numeral';
import {useSelector} from "react-redux";
import {selectLoggedIn} from "../../user/selectors";
import {selectCustomerPricing} from "../../customer/selectors";
import {ProductVariant} from "b2b-types";
import Button from "@mui/material/Button";
import {styled} from '@mui/material/styles';
import Stack, {StackProps} from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {ResponsiveStyleValue} from "@mui/system";


const VariantButtonBase = styled(Button)(({theme}) => ({
    width: '100%',
}));


const VariantButton = ({variant, selected, direction, spacing, onClick}: {
    variant: ProductVariant;
    selected: boolean;
    direction?: ResponsiveStyleValue<'row' | 'row-reverse' | 'column' | 'column-reverse'>;
    spacing?: ResponsiveStyleValue<number | string>;
    onClick: (variant: ProductVariant) => void;
}) => {
    const priceCodes = useSelector(selectCustomerPricing);
    const loggedIn = useSelector(selectLoggedIn);
    const prices = loggedIn
        ? getPrices(variant.product, priceCodes)
        : getMSRP(variant.product);
    const salesUM = getSalesUM(variant.product);

    return (
        <VariantButtonBase variant={selected ? 'contained' : 'outlined'}
                           onClick={() => onClick(variant)}>
            <Stack direction={direction ?? {xs: 'row', sm: 'column'}}
                   spacing={spacing ?? {xs: 2, sm: 0}} alignItems="center">
                <Box>
                    <Typography variant="variantButtonText" dangerouslySetInnerHTML={{__html: variant.title}}/>
                </Box>
                <Box>
                    <Typography variant="variantButtonPrice">
                        $ {prices.map(price => numeral(price).format('0.00')).join(' - ')}
                        {' '}
                        ({salesUM || 'EA'})
                    </Typography>
                </Box>
            </Stack>
        </VariantButtonBase>
    )
}

export default VariantButton
