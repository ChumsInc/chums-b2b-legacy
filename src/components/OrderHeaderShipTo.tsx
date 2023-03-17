import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import FormGroup from "../common-components/FormGroup";
import ShipToSelect from "./ShipToSelect";
import ShipToAddress from "./Address/ShipToAddress";
import {selectIsCart, selectSalesOrderHeader} from "../selectors/salesOrder";
import {updateCart} from "../actions/cart";
import {selectCartProgress} from "../selectors/cart";
import {CART_PROGRESS_STATES} from "../constants/orders";
import {selectCustomerShipToAddresses} from "../selectors/customer";
import {isSalesOrderHeader} from "../utils/typeguards";
import {SalesOrderHeader} from "b2b-types";

const OrderHeaderShipTo = () => {
    const dispatch = useDispatch();
    const orderHeader = useSelector(selectSalesOrderHeader);
    const isCart = useSelector(selectIsCart);
    const cartProgress = useSelector(selectCartProgress);
    const shipToAddresses = useSelector(selectCustomerShipToAddresses);

    const changeHandler = (shipToCode: string | null) => {
        const [shipTo] = shipToAddresses.filter(shipTo => shipTo.ShipToCode === shipToCode);
        if (!shipTo && isSalesOrderHeader(orderHeader)) {
            const {
                BillToName,
                BillToAddress1,
                BillToAddress2,
                BillToAddress3,
                BillToCity,
                BillToState,
                BillToCountryCode,
                BillToZipCode
            } = orderHeader;
            const props: Partial<SalesOrderHeader> = {
                ShipToCode: '',
                ShipToName: BillToName,
                ShipToAddress1: BillToAddress1,
                ShipToAddress2: BillToAddress2,
                ShipToAddress3: BillToAddress3,
                ShipToZipCode: BillToZipCode,
                ShipToCity: BillToCity,
                ShipToState: BillToState,
                ShipToCountryCode: BillToCountryCode
            }
            dispatch(updateCart(props, cartProgress !== CART_PROGRESS_STATES.cart));
            return;
        }
        const {
            ShipToCode,
            ShipToName,
            ShipToAddress1,
            ShipToAddress2,
            ShipToAddress3,
            ShipToCity,
            ShipToState,
            ShipToCountryCode,
            ShipToZipCode
        } = shipTo;
        const props = {
            ShipToCode,
            ShipToName,
            ShipToAddress1,
            ShipToAddress2,
            ShipToAddress3,
            ShipToCity,
            ShipToState,
            ShipToCountryCode,
            ShipToZipCode
        };
        dispatch(updateCart(props, cartProgress !== CART_PROGRESS_STATES.cart))
    }

    if (!isSalesOrderHeader(orderHeader)) {
        return null;
    }
    return (
        <>
            <FormGroup colWidth={8} label="Ship To">
                <ShipToSelect value={orderHeader.ShipToCode || ''} defaultName="Default Address" disabled={!isCart}
                              onChange={changeHandler}/>
            </FormGroup>
            <FormGroup colWidth={8} label="Address">
                <ShipToAddress address={orderHeader} className="form-control form-control-sm"/>
            </FormGroup>
        </>
    )
}

export default OrderHeaderShipTo;
