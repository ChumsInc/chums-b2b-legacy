import React, {useEffect, useState} from 'react';
import {SELL_AS_COLOR, SELL_AS_MIX} from "../../../constants/actions";
import Swatch from "./Swatch";
import {useAppDispatch} from "../../../app/configureStore";
import {useSelector} from "react-redux";
import {selectProductCartItem, selectProductColorCode, selectSelectedProduct} from "../selectors";
import {setColorCode} from "../actions";
import {ProductSwatchBase} from "b2b-types";
import {ga_viewItem} from "../../../utils/google-analytics";
import {isSellAsColors, isSellAsMix} from "../utils";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {styled} from "@mui/material/styles";

const SwatchContainer = styled(Box)`
    display: flex; 
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    align-items: flex-start;
`

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
        if (isSellAsMix(selectedProduct)) {
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
            <Box>
                <Typography variant="body1" sx={{mr: 3, display: 'inline-block'}}>
                    {selectedProduct.sellAs === SELL_AS_MIX && (<span>Selected Color:</span>)}
                    {selectedProduct.sellAs === SELL_AS_COLOR && (<span>Color:</span>)}
                </Typography>
                <Typography variant="body1" sx={{fontWeight: 700, display: 'inline-block'}}>{cartItem?.colorName}</Typography>
            </Box>
            <SwatchContainer>
                {items
                    .map(item => (
                        <Swatch key={item.id} color={item.color ?? null}
                                itemQuantity={item.itemQuantity}
                                swatchFormat={item?.additionalData?.swatch_code || swatchFormat}
                                active={colorCode === item.color?.code}
                                newColor={item.additionalData?.season?.active}
                                onClick={clickHandler}/>
                    ))}
            </SwatchContainer>
        </>
    )

}

export default SwatchSet
