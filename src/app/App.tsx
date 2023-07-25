import React, {Fragment, useEffect} from 'react';
import {Redirect, Route} from 'react-router-dom';
import Footer from '../components/Footer';
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
import Header from "../components/Header";
import Login from "../components/LoginPage";
import AlertList from "../ducks/alerts/AlertList";
import ProductRouter from "../ducks/products/components/ProductRouter";
import {useDispatch, useSelector} from 'react-redux';
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
import AppUpdateLocalLogin from "../components/AppUpdateLocalLogin";
import Logout from "../components/Logout";
import ResetPassword from "../components/ResetPassword";
import DocumentTitle from "../components/DocumentTitle";
import ContentPage from "../components/ContentPage";
import InvoicePage from "../ducks/invoices/components/InvoicePage";
import ErrorBoundary from "../common-components/ErrorBoundary";
import {selectCurrentCustomer, selectLoggedIn, selectUserLoading} from "../ducks/user/selectors";
import {selectCustomerLoading} from "../ducks/customer/selectors";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import AccountListContainer from "../components/profile/AccountListContainer";
import {useAppDispatch} from "./configureStore";


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
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Route component={Header}/>
                <main>
                    <DocumentTitle/>
                    <Route path={PATH_PRODUCT} component={LifestyleImage}/>
                    <div className="container main-container">
                        {!!loggedIn && <AppUpdateLocalLogin/>}
                        <AlertList/>
                        {loggedIn && <Route path={PATH_HOME} component={ProfilePage}/>}
                        {loggedIn && <Route path="/" exact component={ProfilePage}/>}
                        {!loggedIn && <Route path={PATH_HOME} component={Login}/>}
                        {!loggedIn && <Route path="/" exact component={Login}/>}

                        {/*<Route path="/" exact component={ProfilePage}/>*/}

                        {/* The login and signup paths will redirect away to home when the user is logged in */}
                        <ErrorBoundary>
                            <Route path={PATH_LOGIN} component={Login}/>
                            <Route path={PATH_SIGNUP} component={SignUp}/>
                            <Route path={PATH_SET_PASSWORD} component={ResetPassword}/>
                        </ErrorBoundary>

                        <Route path={PATH_PRODUCT} component={ProductRouter}/>
                        {!loggedIn && (
                            <Route path={PATH_RESOURCES_CHUMS_REPS}>
                                <Redirect to={PATH_PAGE_RESOURCES}/>
                            </Route>
                        )}
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
                                <Route exact path="/profile" component={ProfilePage}/>
                                <Route path="/profile/:id" component={AccountListContainer}/>
                                <Route path="/account/:Company/:ARDivisionNo-:CustomerNo/:ShipToCode?" component={AccountPage}/>
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
                                {(!currentCustomer || !currentCustomer.CustomerNo) && (
                                    <Route exact path={PATH_SALES_ORDER}
                                           component={AccountList}/>
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
