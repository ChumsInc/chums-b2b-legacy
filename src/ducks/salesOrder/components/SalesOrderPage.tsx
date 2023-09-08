import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {generatePath, redirect} from 'react-router-dom';
import {setCurrentCart} from '../../cart/actions';
import {NEW_CART} from "@/constants/orders";
import OrderDetail from "@/components/OrderDetail";
import SendEmailModal from "@/ducks/salesOrder/components/SendEmailModal";
import CheckoutProgress from "@/components/CheckoutProgress";
import Alert from "@mui/material/Alert";
import DocumentTitle from "@/components/DocumentTitle";
import {useMatch, useNavigate} from "react-router";
import {selectCustomerAccount, selectCustomerLoading} from "../../customer/selectors";
import {
    selectAttempts,
    selectIsCart,
    selectSendEmailStatus,
    selectSalesOrderProcessing,
    selectSalesOrderHeader,
    selectSalesOrderNo,
    selectSendEmailResponse,
    selectSOLoading
} from "../selectors";
import {selectCartNo} from "../../cart/selectors";
import {useAppDispatch} from "@/app/configureStore";
import {loadSalesOrder} from "@/ducks/salesOrder/actions";
import SalesOrderHeaderElement from "@/ducks/salesOrder/components/SalesOrderHeaderElement";
import LinearProgress from "@mui/material/LinearProgress";

const SalesOrderPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const match = useMatch('/account/:customerSlug/:orderType/:salesOrderNo');
    const customer = useSelector(selectCustomerAccount);
    const salesOrderNo = useSelector(selectSalesOrderNo);
    const salesOrderHeader = useSelector(selectSalesOrderHeader);
    const loading = useSelector(selectSOLoading);
    const customerLoading = useSelector(selectCustomerLoading);
    const salesOrderProcessing = useSelector(selectSalesOrderProcessing)
    const isCart = useSelector(selectIsCart);
    const sendEmailStatus = useSelector(selectSendEmailResponse);
    const sendingEmail = useSelector(selectSendEmailStatus);
    const attempts = useSelector(selectAttempts);
    const cartNo = useSelector(selectCartNo);

    const processing = customerLoading || salesOrderProcessing !== 'idle' || loading;
    const {OrderStatus, OrderType} = salesOrderHeader ?? {};
    const isCurrentCart = cartNo === salesOrderNo;

    useEffect(() => {
        console.debug(customer, match);
        if (customer && !!customer.CustomerNo) {
            if (!salesOrderProcessing && !!match?.params?.salesOrderNo && match?.params?.salesOrderNo !== salesOrderNo && attempts < 4) {
                dispatch(loadSalesOrder(match.params.salesOrderNo))
            }
        }
    }, []);

    useEffect(() => {
        if (salesOrderHeader?.OrderStatus === 'Z' && match?.params?.orderType && match?.params?.customerSlug) {
            const path = generatePath(`/account/:customerSlug/:orderType`, {customerSlug: match.params.customerSlug, orderType: match.params.orderType});
            navigate(path, {replace: true});
        }
    }, [salesOrderHeader?.OrderStatus]);

    useEffect(() => {
        if (customer && !!customer.CustomerNo) {
            if (match?.params?.salesOrderNo === NEW_CART && !isCurrentCart) {
                dispatch(setCurrentCart(match.params.salesOrderNo));
                return;
            }
            if (!!match?.params?.salesOrderNo && match.params.salesOrderNo !== NEW_CART && match.params.salesOrderNo !== salesOrderNo && !processing && attempts < 4) {
                dispatch(loadSalesOrder(match.params.salesOrderNo));
            }
        }
    }, [cartNo, match?.params?.salesOrderNo, salesOrderNo, isCurrentCart, processing])


    if (!customer && !customerLoading) {
        redirect('/profile');
        return;
    }

    const documentTitle = `${isCart ? 'Cart' : 'Order'} Info #${match?.params?.salesOrderNo}`;
    return (
        <div>
            <DocumentTitle documentTitle={documentTitle}/>
            <div className="sales-order-page">
                <h2>{isCart ? 'Cart' : 'Sales Order'} #{salesOrderNo}</h2>
                {OrderStatus === 'X' && (
                    <Alert severity="error" title="Note:">
                        This order has been cancelled. Please contact Customer Service if you have any questions.
                    </Alert>
                )}
                {processing && <LinearProgress variant="indeterminate" sx={{my: 1}}/>}
                <SalesOrderHeaderElement/>
                {match?.params?.salesOrderNo === salesOrderNo && <OrderDetail/>}
            </div>
        </div>
    )
}

export default SalesOrderPage;
