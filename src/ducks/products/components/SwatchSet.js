import React, {useEffect, useState} from 'react';
import {SELL_AS_COLOR, SELL_AS_MIX} from "../../../constants/actions";
import Swatch from "../../../components/Swatch";
import {useAppDispatch} from "../../../app/configureStore";
import {useSelector} from "react-redux";
import {selectProductCartItem, selectProductColorCode, selectSelectedProduct} from "../selectors";
import {setColorCode} from "../../../actions/products";

const isInactiveItem = (item) => {
    return !item.status
        || !!item.inactiveItem
        || item.productType === 'D'
}

const SwatchSet = () => {
    const dispatch = useAppDispatch();
    const selectedProduct = useSelector(selectSelectedProduct);
    const cartItem = useSelector(selectProductCartItem);
    const colorCode = useSelector(selectProductColorCode);
    const [items, setItems] = useState([]);
    const [swatchFormat, setSwatchFormat] = useState(selectedProduct?.additionalData?.swatch_format || '?')


    useEffect(() => {
        if (!selectedProduct) {
            return;
        }
        setSwatchFormat(selectedProduct?.additionalData?.swatch_format || '?');
        switch (selectedProduct.sellAs) {
            case SELL_AS_MIX:
                setItems(selectedProduct.mix.items ?? []);
                return;
            case SELL_AS_COLOR:
                setItems((selectedProduct.items ?? []).filter(item => !isInactiveItem(item)));
                return;
            default:
                setItems([]);
        }
    }, [selectedProduct])

    const clickHandler = (colorCode) => dispatch(setColorCode(colorCode));

    if (!selectedProduct || !items.length) {
        return null;
    }

    return (
        <>
            <div>
                {selectedProduct.sellAs === SELL_AS_MIX && (<span className="me-3">Selected Color:</span>)}
                {selectedProduct.sellAs === SELL_AS_COLOR && (<span className="me-3">Color:</span>)}
                <strong>{cartItem.colorName}</strong>
            </div>
            <div className="swatch-container">
                <div className="swatch-set">
                    {items
                        .map(item => (
                            <Swatch key={item.id} color={item.color}
                                    itemQuantity={item.itemQuantity || null}
                                    swatchFormat={item?.additionalData?.swatch_code || swatchFormat}
                                    active={colorCode === item.color.code}
                                    onClick={clickHandler}/>
                        ))}
                </div>
            </div>
        </>
    )

}

export default SwatchSet
