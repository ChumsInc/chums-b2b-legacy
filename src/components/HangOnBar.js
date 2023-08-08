/**
 * Created by steve on 8/10/2016.
 */

import React from 'react';
import CustomerNavbarLink from "./CustomerNavbarLink";
import CartIndicator from "../ducks/cart/components/CartIndicator";
import {useDispatch} from 'react-redux';
import {toggleXSNavBar} from '../ducks/app/actions';
import GoogleSignInOneTap from "./GoogleSignInOneTap";
import SiteMessages from "../ducks/messages/SiteMessages";
import SearchBar from "../ducks/search/components/SearchBar";

const HangOnBar = () => {
    const dispatch = useDispatch();
    const clickHandler = () => {
        dispatch(toggleXSNavBar());
    }
    return (
        <>
            <SiteMessages/>
            <div className="top-bar">
                <button className="chums-navbar-toggler" type="button" aria-label="Toggle Navigation"
                        onClick={clickHandler}>
                    <span className="navbar-toggler-icon"/>
                </button>
                <ul className="navbar-nav">
                    {/*<AppGoogleLogin/>*/}
                    <li className="nav-item search">
                        <SearchBar/>
                    </li>
                    {/*<li className="nav-item search">*/}
                    {/*    <SearchBar />*/}
                    {/*</li>*/}
                    <li className="nav-item main-logo">
                        <h1>
                            <a className="nav-link home-link" href="#">&nbsp;<span className="sr-only">Chums Inc.</span></a>
                        </h1>
                    </li>
                    <li className="nav-item cart">
                        <div className="current-customer-indicator">
                            <GoogleSignInOneTap/>
                            <CustomerNavbarLink/>
                            <CartIndicator/>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default HangOnBar
