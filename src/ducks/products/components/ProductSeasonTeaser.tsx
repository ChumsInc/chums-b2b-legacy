import React from 'react';
import SeasonTeaser from "../../../components/SeasonTeaser";
import {useSelector} from "react-redux";
import {
    selectCurrentProduct,
    selectProductCartItem,
    selectProductSeasonActive,
    selectProductSeasonTeaser, selectSelectedProduct
} from "../selectors";
import {Collapse} from "@mui/material";

const ProductSeasonTeaser = () => {
    const product = useSelector(selectSelectedProduct);
    const show = !!product?.season?.product_teaser && product?.season?.active;
    return (
        <Collapse in={show}>
            <SeasonTeaser
                season_teaser={product?.season?.product_teaser}
                season_active={product?.season?.active}/>
        </Collapse>
    )
}

export default ProductSeasonTeaser;
