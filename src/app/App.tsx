import React, {Fragment, useEffect} from 'react';
import {Route, Routes} from 'react-router-dom';
import {PATH_INVOICE, PATH_LOGOUT, PATH_SALES_ORDER_BREADCRUMB, PATH_SALES_ORDERS} from "../constants/paths";
import Login from "../components/LoginPage";
import {useSelector} from 'react-redux';
import {loadProfile} from '../ducks/user/actions';
import {loadCustomer} from '../ducks/customer/actions';
import ProfilePage from "@/ducks/user/components/ProfilePage";
import AccountPage from "@/ducks/customer/components/AccountPage";
import AccountList from "../components/profile/AccountList";
import OrdersContainer from "../components/OrdersContainer";
import SalesOrderPage from "@/ducks/salesOrder/components/SalesOrderPage";
import OrdersBreadcrumb from "../components/OrdersBreadcrumb";
import SignUp from "../components/SignUp";
import Logout from "../components/Logout";
import ResetPassword from "../components/ResetPassword";
import ContentPage from "../ducks/page/ContentPage";
import InvoicePage from "../ducks/invoices/components/InvoicePage";
import ErrorBoundary from "../common-components/ErrorBoundary";
import {selectCurrentCustomer, selectLoggedIn, selectUserLoading} from "../ducks/user/selectors";
import {selectCustomerLoading} from "../ducks/customer/selectors";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import AccountListContainer from "../components/profile/AccountListContainer";
import {useAppDispatch} from "./configureStore";
import {isCustomer} from "../ducks/user/utils";
import RepResourcesRedirect from "../ducks/page/RepResourcesRedirect";
import MainOutlet from "./MainOutlet";
import ProductRouter from "@/ducks/products/components/ProductRouter";
import BillToForm from "@/ducks/customer/components/BillToForm";
import ShipToForm from "@/ducks/customer/components/ShipToForm";
import AccountUsers from "@/components/AccountUsers/AccountUsers";
import {CssBaseline} from "@mui/material";
import ContentPage404 from "@/components/ContentPage404";
import CartsList from "@/ducks/carts/components/CartsList";
import OpenOrdersList from "@/components/OpenOrdersList";
import InvoicesList from "@/ducks/invoices/components/InvoicesList";
import ShipToList from "@/ducks/customer/components/ShipToList";


const App = () => {
    const dispatch = useAppDispatch();
    const loggedIn = useSelector(selectLoggedIn);
    const currentCustomer = useSelector(selectCurrentCustomer);
    const customerLoading = useSelector(selectCustomerLoading);
    const userLoading = useSelector(selectUserLoading);

    useEffect(() => {
        if (!loggedIn) {
            return;
        }
        dispatch(loadProfile());
        if (!!currentCustomer && !customerLoading) {
            dispatch(loadCustomer(currentCustomer));
        }
    }, [loggedIn]);

    return (
        <ErrorBoundary>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CssBaseline>
                    <Routes>
                        <Route path="/" element={<MainOutlet/>}>
                            <Route path="/products" element={<ProductRouter/>}/>
                            <Route path="/products/:category" element={<ProductRouter/>}/>
                            <Route path="/products/:category/:product" element={<ProductRouter/>}/>
                            {!loggedIn && (
                                <>
                                    <Route path="/pages/chums-reps" element={<RepResourcesRedirect/>}/>
                                    <Route path="/set-password" element={<ResetPassword/>}/>
                                    <Route path="/signup" element={<SignUp/>}/>
                                    <Route path="*" element={<Login/>}/>
                                </>
                            )}
                            {loggedIn && (
                                <>
                                    <Route index element={<ProfilePage/>}/>
                                    <Route path="/home" element={<ProfilePage/>}/>
                                    <Route path="/pages/:keyword" element={<ContentPage/>}/>
                                    <Route path={PATH_LOGOUT} element={<Logout/>}/>
                                    <Route path="/profile" element={<ProfilePage/>}/>
                                    <Route path="/profile/:id" element={<AccountListContainer/>}/>
                                    <Route path="/account/:customerSlug" element={<AccountPage/>}>
                                        <Route index element={<BillToForm/>}/>
                                        <Route path="delivery" element={<ShipToList/>}/>
                                        <Route path="delivery/:shipToCode" element={<ShipToForm/>}/>
                                        {/*<Route path="delivery" element={<ShipToForm/>}/>*/}
                                        <Route path="users" element={<AccountUsers/>}/>
                                        <Route path="carts" element={<CartsList/>}/>
                                        <Route path="carts/:salesOrderno" element={<SalesOrderPage/>}/>
                                        <Route path="orders" element={<OpenOrdersList/>}/>
                                        <Route path="orders/:salesOrderno" element={<SalesOrderPage/>}/>
                                        <Route path="invoices" element={<InvoicesList/>}/>
                                        <Route path="*" element={<ContentPage404/>}/>
                                    </Route>
                                    <Route path={PATH_SALES_ORDER_BREADCRUMB} element={<OrdersBreadcrumb/>}/>
                                    <Route path={PATH_INVOICE} element={<OrdersBreadcrumb/>}/>
                                    <Route path={PATH_SALES_ORDERS} element={<OrdersContainer/>}/>
                                    {isCustomer(currentCustomer) && (
                                        <>
                                            <Route path="/orders/:orderType/:Company/:SalesOrderNo"
                                                   element={<SalesOrderPage/>}/>
                                            <Route path="/invoices/:Company/:InvoiceType/:InvoiceNo"
                                                   element={<InvoicePage/>}/>
                                        </>
                                    )}
                                    {(!isCustomer(currentCustomer)) && (
                                        <>
                                            <Route path="/orders/:orderType/:Company/:SalesOrderNo"
                                                   element={<AccountList/>}/>
                                            <Route path="/invoices/:Company/:InvoiceType/:InvoiceNo"
                                                   element={<AccountList/>}/>
                                        </>
                                    )}
                                    <Route path="*" element={<ContentPage404/>}/>
                                </>
                            )}
                        </Route>
                    </Routes>
                </CssBaseline>
            </LocalizationProvider>
        </ErrorBoundary>
    )
}

export default App
