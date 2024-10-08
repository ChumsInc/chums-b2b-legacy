/**
 * Created by steve on 9/9/2016.
 */


import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect, useHistory} from 'react-router-dom';
import {loadSalesOrder} from '../actions/salesOrder';
import {newCart, setCurrentCart} from '../actions/cart';
import ProgressBar from "./ProgressBar";
import {NEW_CART} from "../constants/orders";
import OrderHeader from "./OrderHeader";
import OrderDetail from "./OrderDetail";
import SendEmailModal from "./SendEmailModal";
import CheckoutProgress from "./CheckoutProgress";
import Alert from "../common-components/Alert";
import DocumentTitle from "./DocumentTitle";
import {useParams} from "react-router";
import {selectCustomerAccount, selectCustomerLoading} from "../selectors/customer";
import {
    selectAttempts,
    selectIsCart,
    selectProcessing,
    selectSalesOrderHeader,
    selectSalesOrderNo,
    selectSendingEmailStatus
} from "../selectors/salesOrder";
import {selectCartLoading, selectCartNo} from "../selectors/cart";

const SalesOrderPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {Company, SalesOrderNo} = useParams();
    const customer = useSelector(selectCustomerAccount);
    const salesOrderNo = useSelector(selectSalesOrderNo);
    const salesOrderHeader = useSelector(selectSalesOrderHeader);
    const customerLoading = useSelector(selectCustomerLoading);
    const salesOrderProcessing = useSelector(selectProcessing)
    const isCart = useSelector(selectIsCart);
    const sendEmailStatus = useSelector(selectSendingEmailStatus);
    const attempts = useSelector(selectAttempts);
    const cartNo = useSelector(selectCartNo);
    const cartLoading = useSelector(selectCartLoading);

    const processing = customerLoading || cartLoading || salesOrderProcessing;
    const {OrderStatus, OrderType} = salesOrderHeader ?? {};
    const isCurrentCart = cartNo === salesOrderNo;

    useEffect(() => {
        // console.debug(customer, SalesOrderNo);
        if (customer && !!customer.CustomerNo) {
            if (SalesOrderNo === NEW_CART && salesOrderNo !== NEW_CART) {
                dispatch(newCart());
            } else if (!!!salesOrderProcessing && SalesOrderNo !== salesOrderNo && attempts < 4) {
                const {ARDivisionNo, CustomerNo} = customer;
                dispatch(loadSalesOrder(SalesOrderNo))
            }
        }
    }, []);

    useEffect(() => {
        if (customer && !!customer.CustomerNo) {
            if (SalesOrderNo === NEW_CART && !isCurrentCart) {
                dispatch(setCurrentCart({Company, SalesOrderNo}));
                return;
            }
            if (SalesOrderNo !== NEW_CART && SalesOrderNo !== salesOrderNo && !processing && attempts < 4) {
                const {ARDivisionNo, CustomerNo} = customer;
                dispatch(loadSalesOrder(SalesOrderNo));
            }
        }
    }, [cartNo, SalesOrderNo, salesOrderNo, isCurrentCart, processing])


    if (!customer && !customerLoading) {
        return (<Redirect to="/profile"/>);
    }

    const documentTitle = `${isCart ? 'Cart' : 'Order'} Info #${salesOrderNo}`;
    return (
        <div>
            <DocumentTitle documentTitle={documentTitle}/>
            <div className="sales-order-page">
                <h2>{isCart ? 'Cart' : 'Sales Order'} #{salesOrderNo}</h2>
                {OrderStatus === 'X' && (
                    <Alert type="alert-danger" title="Note:">
                        This order has been cancelled. Please contact Customer Service if you have any questions.
                    </Alert>
                )}
                <OrderHeader history={history}/>
                {processing && <ProgressBar striped={true} label="Loading" className="mb-3"/>}
                {isCart && <CheckoutProgress/>}
                {SalesOrderNo === salesOrderNo && <OrderDetail/>}
                {(sendEmailStatus.sending || sendEmailStatus.messageId) && <SendEmailModal/>}
            </div>
        </div>
    )
}

export default SalesOrderPage;
