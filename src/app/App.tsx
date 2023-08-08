import React, {Fragment, useEffect} from 'react';
import {Route, Routes} from 'react-router-dom';
import Footer from '../components/Footer';
import {PATH_INVOICE, PATH_LOGOUT, PATH_SALES_ORDER_BREADCRUMB, PATH_SALES_ORDERS} from "../constants/paths";
import Header from "../components/Header";
import Login from "../components/LoginPage";
import {useSelector} from 'react-redux';
import LifestyleImage from "../components/LifestyleImage";
import {loadCustomerPermissions, loadProfile} from '../ducks/user/actions';
import {loadCustomerAccount} from '../ducks/customer/actions';
import ProfilePage from "../components/ProfilePage";
import AccountPage from "../components/AccountPage";
import AccountList from "../components/profile/AccountList";
import OrdersContainer from "../components/OrdersContainer";
import SalesOrderPage from "../components/SalesOrderPage";
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
        if (!customerLoading) {
            dispatch(loadCustomerAccount({fetchOrders: true}));
            dispatch(loadCustomerPermissions());
        }
    }, [loggedIn]);

    return (
        <ErrorBoundary>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Routes>
                    <Route path="/" element={<Header/>}/>
                </Routes>

                <main>
                    <Routes>
                        <Route path="/" element={<MainOutlet/>}>
                            <Route path="/products/:category/:product?" element={<LifestyleImage/>}/>
                            {!loggedIn && (
                                <>
                                    <Route index element={<Login/>}/>
                                    <Route path="/login" element={<Login/>}/>
                                    <Route path="/home" element={<Login/>}/>
                                    <Route path="/orders/:orderType?" element={<Login/>}/>
                                    <Route path="/orders/:orderType/:Company/:SalesOrderNo" element={<Login/>}/>
                                    <Route path="/pages/chums-reps" element={<RepResourcesRedirect/>}/>
                                    <Route path="/set-password" element={<ResetPassword/>}/>
                                    <Route path="/signup" element={<SignUp/>}/>
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
                                    <Route path="/account/:Company/:ARDivisionNo-:CustomerNo/:ShipToCode?"
                                           element={<AccountPage/>}/>
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
                                </>
                            )}
                        </Route>
                    </Routes>
                </main>
                <Footer/>
            </LocalizationProvider>
        </ErrorBoundary>
    )
}

export default App
