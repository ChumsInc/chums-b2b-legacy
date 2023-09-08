import React, {useEffect} from 'react';
import DocumentTitle from "../DocumentTitle";
import {useSelector} from "react-redux";
import {selectIsCart, selectSalesOrderProcessing, selectSalesOrderNo, selectSendEmailResponse} from "../../ducks/salesOrder/selectors";
import ProgressBar from "../ProgressBar";
import CartHeader from "./CartHeader";
import CheckoutProgress from "../CheckoutProgress";
import CartDetail from "./CartDetail";
import SendEmailModal from "@/ducks/salesOrder/components/SendEmailModal";
import {useParams} from "react-router";
import {selectCurrentCustomer} from "../../ducks/user/selectors";

const CartPage = () => {
    const currentCustomer = useSelector(selectCurrentCustomer);
    const salesOrderNo = useSelector(selectSalesOrderNo);
    const isCart = useSelector(selectIsCart);
    const processing = useSelector(selectSalesOrderProcessing);
    const emailStatus = useSelector(selectSendEmailResponse);
    const params = useParams()

    useEffect(() => {
        if (salesOrderNo !== params.SalesOrderNo) {
            // dispatch()
        }
    }, [])

    if (!isCart) {
        return null;
    }

    const documentTitle = `Cart Info #${salesOrderNo}`;
    return (
        <div className="sales-order-page">
            <DocumentTitle documentTitle={documentTitle}/>
            <h2>Cart #{salesOrderNo}</h2>
            {processing && <ProgressBar striped label="Loading" className="mb-3"/>}
            <CartHeader/>
            <CheckoutProgress/>
            <CartDetail/>
            {(emailStatus.sending || emailStatus.messageId) && <SendEmailModal/>}
        </div>
    )
}

export default CartPage;
