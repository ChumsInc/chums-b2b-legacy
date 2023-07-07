import React from 'react';
import SeasonTeaser from "../../../components/SeasonTeaser";
import {useSelector} from "react-redux";
import {selectProductCartItem, selectProductSeasonActive, selectProductSeasonTeaser} from "../selectors";

const ProductSeasonTeaser = () => {
    const cartItem = useSelector(selectProductCartItem);
    const season_teaser = useSelector(selectProductSeasonTeaser);
    const season_active = useSelector(selectProductSeasonActive);
    return (
        <SeasonTeaser
            season_teaser={cartItem?.additionalData?.season?.product_teaser || season_teaser}
            season_active={season_active}/>
    )
}

export default ProductSeasonTeaser;
