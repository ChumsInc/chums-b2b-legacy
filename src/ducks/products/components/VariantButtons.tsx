import React, {useState} from 'react';
import {getMSRP, getPrices, getSalesUM, sortVariants} from "../../../utils/products";
import {useSelector} from "react-redux";
import {selectLoggedIn} from "../../user/selectors";
import {selectCurrentProduct, selectProductVariantId} from "../selectors";
import {useAppDispatch} from "../../../app/configureStore";
import {setCurrentVariant} from "../actions";
import {selectCustomerPricing} from "../../customer/selectors";
import {ProductVariant} from "b2b-types";
import {isSellAsVariants} from "../utils";
import VariantButton from "./VariantButton";
import Grid2 from "@mui/material/Unstable_Grid2";

const VariantButtons = () => {
    const dispatch = useAppDispatch();
    const selectedVariantId = useSelector(selectProductVariantId);
    const loggedIn = useSelector(selectLoggedIn);
    const product = useSelector(selectCurrentProduct);
    const priceCodes = useSelector(selectCustomerPricing);
    const [show, setShow] = useState(false);

    if (!isSellAsVariants(product)) {
        return null;
    }

    const variants = product?.variants ?? [];

    const onClickSelector = () => setShow(!show);

    const selectHandler = (variant: ProductVariant) => {
        if (!variant || !variant.id) {
            return;
        }
        setShow(false);
        dispatch(setCurrentVariant(variant))
    }

    // const {productId, variants, selectedVariantId, priceCodes} = this.props;
    const [variant] = variants.filter(v => v.id === selectedVariantId);

    const activeVariants = variants.filter(v => v.status && v.product?.status)
        .sort(sortVariants);

    if (!product.variants || !product.variants.length) {
        return null;
    }

    if (!variant) {
        return null;
    }

    const prices = loggedIn
        ? getPrices(variant?.product, priceCodes)
        : getMSRP(variant?.product);
    const salesUM = getSalesUM(variant.product);

    if (activeVariants.length === 1) {
        return (
            <Grid2 container>
                <Grid2 xs={12}>
                    <VariantButton key={variant.id} onClick={selectHandler} variant={variant}
                                   direction="row" selected/>
                </Grid2>
            </Grid2>
        )
    }
    return (
        <Grid2 container spacing={1} direction={{xs: activeVariants.length > 2 ? 'row' : 'column', sm: 'row'}}
               sx={{maxHeight: '200px', overflow: 'auto', mb: 3}}>
            {activeVariants
                .map(variant => (
                    <Grid2 key={variant.id} xs={activeVariants.length > 2 ? 4 : 12} sm={3} md={4} >
                        <VariantButton onClick={selectHandler} variant={variant}
                                       direction={{xs: activeVariants.length > 2 ? 'column' : 'row', sm: 'column'}}
                                       spacing={{xs: activeVariants.length <= 2 ? 2 : 0, sm: 0}}
                                       selected={variant.id === selectedVariantId}/>
                    </Grid2>
                ))
            }
        </Grid2>
    );
}

export default VariantButtons;
