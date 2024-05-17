import React, {useEffect} from 'react';
import {Route, Routes} from 'react-router-dom';
import Login from "../ducks/user/components/LoginPage";
import {useSelector} from 'react-redux';
import {loadProfile} from '../ducks/user/actions';
import {loadCustomer} from '../ducks/customer/actions';
import ProfilePage from "../ducks/user/components/ProfilePage";
import AccountPage from "../ducks/customer/components/AccountPage";
import SalesOrderPage from "../ducks/open-orders/components/SalesOrderPage";
import SignUp from "../ducks/sign-up/SignUp";
import Logout from "../components/Logout";
import ResetPassword from "../ducks/user/components/ResetPassword";
import ContentPage from "../ducks/page/ContentPage";
import InvoicePage from "../ducks/invoices/components/InvoicePage";
import ErrorBoundary from "../common-components/ErrorBoundary";
import {selectCurrentCustomer, selectLoggedIn} from "../ducks/user/selectors";
import {selectCustomerLoaded, selectCustomerLoading} from "../ducks/customer/selectors";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import AccountListContainer from "../ducks/customers/components/AccountListContainer";
import {useAppDispatch} from "./configureStore";
import RepResourcesRedirect from "../ducks/page/RepResourcesRedirect";
import MainOutlet from "./MainOutlet";
import ProductRouter from "../ducks/products/components/ProductRouter";
import BillToForm from "../ducks/customer/components/BillToForm";
import ShipToForm from "../ducks/customer/components/ShipToForm";
import AccountUsers from "../ducks/customer/components/AccountUsers";
import {CssBaseline, ThemeProvider} from "@mui/material";
import ContentPage404 from "../components/ContentPage404";
import CartsList from "../ducks/open-orders/components/CartsList";
import OpenOrdersList from "../ducks/open-orders/components/OpenOrdersList";
import InvoicesList from "../ducks/invoices/components/InvoicesList";
import ShipToList from "../ducks/customer/components/ShipToList";
import theme from "./theme";
import Home from "../components/Home";
import ClosedSalesOrderPage from "../ducks/open-orders/components/ClosedSalesOrderPage";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {GOOGLE_CLIENT_ID} from "../constants/app";
import RequestPasswordResetForm from "../ducks/user/components/RequestPasswordResetForm";
import ChangePasswordPage from "../ducks/user/components/ChangePasswordPage";
import {useIsSSR} from "../hooks/is-server-side";
import LocalStore from "../utils/LocalStore";


const App = () => {
    const isSSR = useIsSSR();
    const dispatch = useAppDispatch();
    const loggedIn = useSelector(selectLoggedIn);
    const currentCustomer = useSelector(selectCurrentCustomer);
    const customerLoading = useSelector(selectCustomerLoading);
    const customerLoaded = useSelector(selectCustomerLoaded);


    useEffect(() => {
        console.log({isSSR});
        if (isSSR) {
            return;
        }
        LocalStore.removeDeprecatedItems();
    }, [isSSR]);


    useEffect(() => {
        if (!loggedIn) {
            return;
        }
        dispatch(loadProfile());
        if (!!currentCustomer && !customerLoading && !customerLoaded) {
            dispatch(loadCustomer(currentCustomer));
        }
    }, [loggedIn]);

    return (
        <ErrorBoundary>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ThemeProvider theme={theme}>
                    <CssBaseline>
                        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                            <Routes>
                                <Route path="/" element={<MainOutlet/>}>
                                    <Route index element={<Home/>}/>
                                    <Route path="/home" element={<Home/>}/>
                                    <Route path="/products" element={<ProductRouter/>}/>
                                    <Route path="/products/:category" element={<ProductRouter/>}/>
                                    <Route path="/products/:category/:product" element={<ProductRouter/>}/>
                                    <Route path="/products/:category/:product/:sku" element={<ProductRouter/>}/>
                                    {!loggedIn && (
                                        <>
                                            <Route path="/pages/chums-reps" element={<RepResourcesRedirect/>}/>
                                            <Route path="/pages/:keyword" element={<ContentPage/>}/>
                                            <Route path="/set-password/:hash/:key" element={<ResetPassword/>}/>
                                            <Route path="/set-password" element={<ResetPassword/>}/>
                                            <Route path="/signup/:hash/:key" element={<ResetPassword/>}/>
                                            <Route path="/signup" element={<SignUp/>}/>
                                            <Route path="/reset-password" element={<RequestPasswordResetForm/>}/>
                                            <Route path="/login" element={<Login/>}/>
                                            <Route path="*" element={<Login/>}/>
                                        </>
                                    )}
                                    {loggedIn && (
                                        <>
                                            <Route path="/pages/:keyword" element={<ContentPage/>}/>
                                            <Route path="/login" element={<Login/>}/>
                                            <Route path="/logout" element={<Logout/>}/>
                                            <Route path="/profile" element={<ProfilePage/>}/>
                                            <Route path="/profile/set-password" element={<ChangePasswordPage/>}/>
                                            <Route path="/profile/:id" element={<AccountListContainer/>}/>
                                            <Route path="/account/:customerSlug" element={<AccountPage/>}>
                                                <Route index element={<BillToForm/>}/>
                                                <Route path="delivery" element={<ShipToList/>}/>
                                                <Route path="delivery/:shipToCode" element={<ShipToForm/>}/>
                                                <Route path="users" element={<AccountUsers/>}/>
                                                <Route path="users/:id" element={<AccountUsers/>}/>
                                                <Route path="carts" element={<CartsList/>}/>
                                                <Route path="carts/:salesOrderNo" element={<SalesOrderPage/>}/>
                                                <Route path="orders" element={<OpenOrdersList/>}/>
                                                <Route path="orders/:salesOrderNo" element={<SalesOrderPage/>}/>
                                                <Route path="closed/:salesOrderNo" element={<ClosedSalesOrderPage/>}/>
                                                <Route path="invoices" element={<InvoicesList/>}/>
                                                <Route path="invoices/:type/:invoiceNo" element={<InvoicePage/>}/>
                                                <Route path="*" element={<ContentPage404/>}/>
                                            </Route>
                                            <Route path="*" element={<ContentPage404/>}/>
                                        </>
                                    )}
                                    <Route path="*" element={<ContentPage404/>}/>
                                </Route>
                            </Routes>
                        </GoogleOAuthProvider>

                    </CssBaseline>
                </ThemeProvider>
            </LocalizationProvider>
        </ErrorBoundary>
    )
}

export default App

