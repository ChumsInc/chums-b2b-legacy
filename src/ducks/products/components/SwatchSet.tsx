import React, {useEffect, useState} from 'react';
import {SELL_AS_COLOR, SELL_AS_MIX} from "@/constants/actions";
import Swatch from "./Swatch";
import {useAppDispatch} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {selectProductCartItem, selectProductColorCode, selectSelectedProduct} from "../selectors";
import {setColorCode} from "@/ducks/products/actions";
import {isSellAsColors, isSellAsMix, ProductSwatchBase} from "b2b-types";
import {ga_viewItem} from "@/utils/google-analytics";


const SwatchSet = () => {
    const dispatch = useAppDispatch();
    const selectedProduct = useSelector(selectSelectedProduct);
    const cartItem = useSelector(selectProductCartItem);
    const colorCode = useSelector(selectProductColorCode);
    const [items, setItems] = useState<(ProductSwatchBase[])>([]);
    const [swatchFormat, setSwatchFormat] = useState(selectedProduct?.additionalData?.swatch_format || '?')


    useEffect(() => {
        if (!selectedProduct) {
            return;
        }
        setSwatchFormat(selectedProduct?.additionalData?.swatch_format || '?');
        if (isSellAsMix((selectedProduct))) {
            setItems(selectedProduct.mix.items);
        } else if (isSellAsColors(selectedProduct)) {
            setItems(selectedProduct.items.filter(item => item.status))
        } else {
            setItems([]);
        }
    }, [selectedProduct])

    useEffect(() => {
        if (cartItem) {
            ga_viewItem(cartItem);
        }
    }, [cartItem]);

    const clickHandler = (colorCode: string | null) => {
        if (colorCode) {
            dispatch(setColorCode(colorCode));
        }
    }

    if (!selectedProduct || !items.length) {
        return null;
    }

    return (
        <>
            <div>
                {selectedProduct.sellAs === SELL_AS_MIX && (<span className="me-3">Selected Color:</span>)}
                {selectedProduct.sellAs === SELL_AS_COLOR && (<span className="me-3">Color:</span>)}
                <strong>{cartItem?.colorCode}</strong>
            </div>
            <div className="swatch-container">
                <div className="swatch-set">
                    {items
                        .map(item => (
                            <Swatch key={item.id} color={item.color ?? null}
                                    itemQuantity={item.itemQuantity}
                                    swatchFormat={item?.additionalData?.swatch_code || swatchFormat}
                                    active={colorCode === item.color?.code}
                                    onClick={clickHandler}/>
                        ))}
                </div>
            </div>
        </>
    )

}

export default SwatchSet
