import React, {Fragment, useEffect} from 'react';
import {Redirect, Route} from 'react-router-dom';
import Footer from './Footer';
import {
    PATH_CUSTOMER_ACCOUNT,
    PATH_HOME,
    PATH_INVOICE,
    PATH_LOGIN,
    PATH_LOGOUT,
    PATH_PAGE,
    PATH_PAGE_RESOURCES,
    PATH_PRODUCT,
    PATH_PROFILE,
    PATH_PROFILE_ACCOUNT,
    PATH_RESOURCES_CHUMS_REPS,
    PATH_SALES_ORDER,
    PATH_SALES_ORDER_BREADCRUMB,
    PATH_SALES_ORDERS,
    PATH_SET_PASSWORD,
    PATH_SIGNUP
} from "../constants/paths";
import Header from "./Header";
import Login from "./LoginPage";
import AlertList from "../common-components/AlertList";
import HomeV2 from "./HomeV2";
import ProductRouter from "./ProductRouter";
import {useDispatch, useSelector} from 'react-redux';
import LifestyleImage from "./LifestyleImage";
import {fetchProfile} from '../actions/user';
import {fetchCustomerAccount} from '../actions/customer';
import ProfilePage from "./ProfilePage";
import AccountPage from "./AccountPage";
import AccountList from "./AccountList";
import OrdersContainer from "./OrdersContainer";
import SalesOrderPage from "./SalesOrderPage";
import OrdersBreadcrumb from "./OrdersBreadcrumb";
import SignUp from "./SignUp";
import AppUpdateLocalLogin from "./AppUpdateLocalLogin";
import Logout from "./Logout";
import ResetPassword from "./ResetPassword";
import DocumentTitle from "./DocumentTitle";
import ContentPage from "./ContentPage";
import InvoicePage from "./InvoicePage";
import ErrorBoundary from "../common-components/ErrorBoundary";
import {selectCurrentCustomer, selectLoggedIn, selectUserLoading} from "../selectors/user";
import {selectCustomerLoading} from "../selectors/customer";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";


const App = () => {
    const dispatch = useDispatch();
    const loggedIn = useSelector(selectLoggedIn);
    const currentCustomer = useSelector(selectCurrentCustomer);
    const customerLoading = useSelector(selectCustomerLoading);
    const userLoading = useSelector(selectUserLoading);

    useEffect(() => {
        if (!loggedIn) {
            return;
        }
        if (!userLoading) {
            dispatch(fetchProfile());
        }
        if (!customerLoading) {
            dispatch(fetchCustomerAccount({fetchOrders: true, reload: true}));
        }
    }, []);

    useEffect(() => {
        if (!loggedIn) {
            return;
        }
        if (!userLoading) {
            dispatch(fetchProfile());
        }
        if (!customerLoading) {
            dispatch(fetchCustomerAccount({fetchOrders: true, reload: true}));
        }
    }, [loggedIn]);

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Route component={Header}/>
            <main>
                <DocumentTitle/>
                <Route component={LifestyleImage}/>
                <Route path={PATH_HOME} component={HomeV2}/>
                <Route path="/" exact component={HomeV2}/>
                <div className="container main-container">
                    {!!loggedIn && <AppUpdateLocalLogin/>}
                    <AlertList/>

                    {/* The login and signup paths will redirect away to home when the user is logged in */}
                    <ErrorBoundary>
                        <Route path={PATH_LOGIN} component={Login}/>
                        <Route path={PATH_SIGNUP} component={SignUp}/>
                        <Route path={PATH_SET_PASSWORD} component={ResetPassword}/>
                    </ErrorBoundary>

                    <Route path={PATH_PRODUCT} component={ProductRouter}/>
                    <Route path={PATH_PAGE} component={ContentPage}/>
                    {!loggedIn && (
                        <Fragment>
                            <Route exact path={PATH_SALES_ORDERS} component={Login}/>
                            <Route exact path={PATH_SALES_ORDER} component={Login}/>
                        </Fragment>
                    )}
                    {!!loggedIn && (
                        <Fragment>
                            <Route path={PATH_LOGOUT} component={Logout}/>
                            <Route exact path={PATH_PROFILE} component={ProfilePage}/>
                            <Route path={PATH_CUSTOMER_ACCOUNT} component={AccountPage}/>
                            <Route path={PATH_PROFILE_ACCOUNT} component={AccountList}/>
                            <Route path={PATH_SALES_ORDER_BREADCRUMB} component={OrdersBreadcrumb}/>
                            <Route path={PATH_INVOICE} component={OrdersBreadcrumb}/>
                            <Route exact path={PATH_SALES_ORDERS} component={OrdersContainer}/>
                            {!!currentCustomer.CustomerNo && (
                                <Fragment>
                                    <ErrorBoundary>
                                        <Route exact path={PATH_SALES_ORDER} component={SalesOrderPage}/>
                                        {/*<Route exact path={PATH_CART_CHECKOUT} component={CartPage}/>*/}
                                        {/*<Route exact path={PATH_SALES_ORDER_OPEN} component={SalesOrderPage}/>*/}
                                        {/*<Route exact path={PATH_SALES_ORDER_PAST} component={SalesOrderPage}/>*/}
                                        {/*<Route exact path={PATH_SALES_ORDER_MASTER} component={SalesOrderPage}/>*/}
                                        {/*<Route exact path={PATH_SALES_ORDER_INVOICES} component={SalesOrderPage}/>*/}
                                    </ErrorBoundary>
                                    <ErrorBoundary>
                                        <Route exact path={PATH_INVOICE} component={InvoicePage}/>

                                    </ErrorBoundary>
                                </Fragment>
                            )}
                            {!currentCustomer.CustomerNo && (
                                <Route exact path={PATH_SALES_ORDER} component={AccountList}/>
                            )}
                        </Fragment>
                    )}
                </div>
            </main>
            <Footer/>
            </LocalizationProvider>
        </>
    )
}

export default App
