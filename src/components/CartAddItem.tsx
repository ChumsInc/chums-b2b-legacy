import React, {FormEvent, useId, useState} from 'react';
import FormGroup from "../common-components/FormGroup";
import {NEW_CART} from "../constants/orders";
import {saveCartItem, saveNewCart} from '../ducks/cart/actions';
import {useAppDispatch, useAppSelector} from "../app/configureStore";
import {selectSalesOrderHeader} from "../ducks/salesOrder/selectors";

const CartAddItem = () => {
    const dispatch = useAppDispatch();
    const salesOrder = useAppSelector(selectSalesOrderHeader);
    const [itemCode, setItemCode] = useState('');
    const [quantity, setQuantity] = useState(1);
    const itemCodeId = useId();
    const quantityId = useId();

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (!salesOrder || !quantity || !salesOrder.CustomerPONo) {
            return;
        }
        const {SalesOrderNo, CustomerPONo} = salesOrder;
        if (SalesOrderNo === NEW_CART) {
            dispatch(saveNewCart({shipToCode: '', cartName: CustomerPONo, itemCode, quantity}));
        } else {
            dispatch(saveCartItem({SalesOrderNo, ItemCode: itemCode, QuantityOrdered: quantity}));
        }
    }

    return (
        <form onSubmit={onSubmit} className="add-cart-item row g-3">
            <label className="col-auto" htmlFor={itemCodeId}>Item SKU</label>
            <div className="col-auto">
                <input type="text" className="form-control form-control-sm"
                       id={itemCodeId}
                       onChange={(ev) => setItemCode(ev.target.value.toUpperCase)}/>
            </div>
            <label className="col-auto" htmlFor={quantityId}>Quantity</label>
            <div className="col-auto">
                <input type="number" className="form-control form-control-sm" min={1} max={9999}
                       id={quantityId}
                       onChange={(ev) => setQuantity(ev.target.valueAsNumber)}/>
            </div>
            <div className="col-auto">
                <button type="submit" className="btn btn-sm btn-outline-primary" disabled={itemCode === ''}>
                    Add Item <span className="bi-bag-fill"/>
                </button>
            </div>
            <FormGroup colWidth={8}>
            </FormGroup>
        </form>
    );
}

export default CartAddItem;

