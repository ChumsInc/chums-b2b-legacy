import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getItemAvailability} from "../ducks/cart/actions";
import {itemPrice} from "../utils/customer";
import CartItemInfo from "./CartItemInfo";
import CartItemDetail from "../ducks/products/components/CartItemDetail";
import AddToCartForm from "../ducks/cart/components/AddToCartForm";
import MissingTaxScheduleAlert from "../ducks/customer/components/MissingTaxScheduleAlert";
import {selectItemAvailability} from "../ducks/cart/selectors";
import {selectCustomerPricing, selectTaxSchedule} from "../ducks/customer/selectors";


/**
 *
 * @param {string} itemCode
 * @param {number} quantity
 * @param {string} comment
 * @param {() => void} onClose
 * @return {JSX.Element}
 * @constructor
 */
const AddToCartContainer = ({itemCode, quantity, comment, onClose}) => {
    const dispatch = useDispatch();
    const itemAvailability = useSelector(selectItemAvailability);
    const taxSchedule = useSelector(selectTaxSchedule);
    const pricing = useSelector(selectCustomerPricing);
    const [_quantity, setQuantity] = useState(quantity);

    useEffect(() => {
        if (itemCode) {
            dispatch(getItemAvailability(itemCode));
        }
    }, [itemCode]);

    useEffect(() => {
        setQuantity(quantity);
    }, [quantity]);


    const onChangeQuantity = (quantity) => {
        setQuantity(+quantity);
    }

    const customerPrice = itemPrice({pricing, itemCode, priceCode: itemAvailability?.PriceCode ?? '', stdPrice: itemAvailability?.StandardUnitPrice ?? 0});
    /**
     *
     * @type {CartItemDetailProps}
     */
    const cartItem = {
        itemCode,
        quantity,
        QuantityAvailable: itemAvailability?.QuantityAvailable ?? 0,
        price: customerPrice,
        salesUM: itemAvailability?.SalesUnitOfMeasure ?? 'EA',
        salesUMFactor: itemAvailability?.SalesUMConvFactor ?? 1,
        stdUM: itemAvailability?.StandardUnitOfMeasure ?? 'EA',
        msrp: itemAvailability?.SuggestedRetailPrice ?? 0,
    }
    return (
        <>
            <div className="my-3">
                <CartItemInfo ItemCode={itemAvailability?.ItemCode ?? itemCode}
                              ItemCodeDesc={itemAvailability?.ItemCodeDesc ?? ''}/>
            </div>
            {!taxSchedule && (<MissingTaxScheduleAlert/>)}
            <AddToCartForm itemCode={itemCode} quantity={_quantity} unitPrice={customerPrice}
                           comment={comment}
                           unitOfMeasure={itemAvailability?.SalesUnitOfMeasure ?? 'EA'}
                           onChangeQuantity={onChangeQuantity}
                           onDone={() => onClose()}/>
            <CartItemDetail cartItem={cartItem}/>
        </>
    );
}

export default AddToCartContainer;
