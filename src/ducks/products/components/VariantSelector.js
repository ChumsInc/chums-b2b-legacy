import React, {useState} from 'react';
import classNames from "classnames";
import {getMSRP, getPrices, getSalesUM, sortVariants} from "../../../utils/products";
import numeral from 'numeral';
import {useSelector} from "react-redux";
import {selectLoggedIn} from "../../../selectors/user";
import {ClickAwayListener} from '@mui/base';
import VariantItem from "../../../components/VariantItem";
import {selectCurrentProduct, selectProductColorCode, selectProductVariantId} from "../selectors";
import {useAppDispatch} from "../../../app/configureStore";
import {setCurrentVariant} from "../../../actions/products";
import {selectCustomerPricing} from "../../customer/selectors";

/**
 *
 * @return {JSX.Element|null}
 * @constructor
 */
const VariantSelector = () => {
    const dispatch = useAppDispatch();
    const selectedVariantId = useSelector(selectProductVariantId);
    const loggedIn = useSelector(selectLoggedIn);
    const product = useSelector(selectCurrentProduct);
    const colorCode = useSelector(selectProductColorCode);
    const priceCodes = useSelector(selectCustomerPricing);
    const [show, setShow] = useState(false);

    const variants = product.variants ?? [];

    const onClickSelector = () => setShow(!show);

    const selectHandler = (variant) => {
        if (!variant || !variant.id) {
            return;
        }
        setShow(false);
        dispatch(setCurrentVariant(variant, colorCode))
    }

    // const {productId, variants, selectedVariantId, priceCodes} = this.props;
    const [variant = {}] = variants.filter(v => v.id === selectedVariantId);

    if (!product.variants || !product.variants.length ) {
        return null;
    }

    const prices = loggedIn
        ? getPrices({product: variant.product, priceCodes})
        : getMSRP(variant.product);
    const salesUM = getSalesUM(variant.product);

    if (variants.filter(v => !!v.status && !!v.product.status).length <= 1) {
        return (
            <div className="variants-container">
                <div className="btn btn-outline-secondary variant-selector">
                    <div>
                            <span className="title"
                                  dangerouslySetInnerHTML={{__html: variant.title || 'Select an option'}}/>

                        <span className="price ms-3">
                                $ {prices.map(price => numeral(price).format('0.00')).join(' - ')}
                            {' '}
                            ({salesUM || 'EA'})
                            </span>
                    </div>
                    {/*{variant.title || 'Select an Option'}*/}
                </div>
            </div>
        )
    }
    return (
        <ClickAwayListener onClickAway={() => setShow(false)}>
            <div className="variants-container dropdown">
                <div className={classNames("btn-group", {show})}>
                    <button type="button" disabled={variants.filter(v => !!v.status && !!v.product.status).length <= 1}
                            className="btn btn-outline-secondary dropdown-toggle variant-selector"
                            onClick={onClickSelector}>
                        <div>
                            <span className="title"
                                  dangerouslySetInnerHTML={{__html: variant.title || 'Select an option'}}/>

                            <span className="price ms-3">
                                $ {prices.map(price => numeral(price).format('0.00')).join(' - ')}
                                {' '}
                                ({salesUM || 'EA'})
                            </span>
                        </div>
                        {/*{variant.title || 'Select an Option'}*/}
                    </button>
                    <div className={classNames("dropdown-menu", {show})}>
                        {variants.filter(v => !!v.status && !!v.product.status)
                            .sort(sortVariants)
                            .map(variant => (
                                <VariantItem key={variant.id} variant={variant}
                                             selected={variant.id === selectedVariantId}
                                             onClick={selectHandler}
                                             priceCodes={priceCodes} loggedIn={loggedIn}/>))
                        }
                    </div>
                </div>
            </div>
        </ClickAwayListener>
    );
}

export default VariantSelector;
