/**
 * Created by steve on 8/31/2016.
 */

import React, {Fragment, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';
import {useSelector} from 'react-redux';
import {PATH_LOGIN, PATH_RESOURCES_CHUMS_REPS, PATH_RESOURCES_CUSTOMER, PATH_SIGNUP} from '../constants/paths';
import {setSubNavBar} from '../ducks/app/actions';
import DropDownToggle from "./DropDownToggle";
import {SUB_NAV_TYPES} from "../constants/app";
import NavBarSubNavContainer from "./NavBarSubNavContainer";
import {useLocation} from "react-router";
import {selectHasMessages} from "../ducks/messages";
import {selectShowSearch} from "../ducks/search";
import {selectShowNavBar, selectSubNav} from "../ducks/app/selectors";
import {selectLoggedIn} from "../ducks/user/selectors";
import {useAppDispatch} from "../app/configureStore";


const NavItem = ({path, title = '', active = false}: {
    path: string;
    title?: string;
    active?: boolean;
}) => {
    return (
        <li className={classNames("nav-item", {active: active})}>
            <Link to={path} className="nav-link">{title}</Link>
        </li>
    )
};


const isPathProducts = new RegExp(`^/products`);
const isPathProfile = new RegExp(`^/(profile|account)`);
const isPathOrders = new RegExp('^/orders');

const NavBar = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const showNavBar = useSelector(selectShowNavBar);
    const subNav = useSelector(selectSubNav);
    const loggedIn = useSelector(selectLoggedIn);
    const hasMessages = useSelector(selectHasMessages);
    const showSearch = useSelector(selectShowSearch);
    const [expanded, setExpanded] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler);
        return () => {
            window.removeEventListener('scroll', scrollHandler);
        }
    }, []);

    useEffect(() => {
        if (scrolled && !document.querySelector('body.scrolled')) {
            document.querySelector('body')!.classList.toggle('scrolled', true);
        } else if (!scrolled && !!document.querySelectorAll('body.scrolled').length) {
            document.querySelector('body')!.classList.toggle('scrolled', false);
        }
    }, [scrolled]);

    const scrollHandler = () => {
        if (window.scrollY > 30 && !scrolled) {
            setScrolled(true);
        } else if (window.scrollY <= 30 && scrolled) {
            setScrolled(false);
        }
    }

    const onExpand = () => {
        setExpanded(!expanded);
    }

    const onSetSubNav = (nextNav: string) => {
        if (nextNav === subNav) {
            dispatch(setSubNavBar(SUB_NAV_TYPES.none));
            return;
        }
        dispatch(setSubNavBar(nextNav));
    }

    return (
        <div className="chums-navbar-container">
            <div className={classNames("chums-navbar navbar-expand-sm", {'has-messages': hasMessages})}>
                {/*<GoogleSignInOneTap />*/}
                <div className={classNames("chums-navbar-collapse collapse", {show: showNavBar})}>
                    <div className="nav-item main-logo navbar-brand">
                        <h1>
                            <Link to="/" className="nav-link home-link">
                                <img className={classNames({scrolled})}
                                     src={"/images/logos/40YearBadgeLogo_RGB_091322.png"} alt="Chums Logo"/>
                            </Link>
                        </h1>
                    </div>
                    <div className="nav-left-container">
                        <ul className="navbar-nav">
                            <DropDownToggle title="Products" show={subNav === SUB_NAV_TYPES.products}
                                            active={isPathProducts.test(location.pathname)}
                                            onClick={() => onSetSubNav(SUB_NAV_TYPES.products)}/>
                            {!loggedIn && (
                                <Fragment>
                                    <NavItem path={PATH_LOGIN} title="Login"
                                             active={location.pathname === PATH_LOGIN}/>
                                    <NavItem path={PATH_SIGNUP} title="Sign Up"
                                             active={location.pathname === PATH_SIGNUP}/>
                                    <NavItem path={PATH_RESOURCES_CUSTOMER} title="Resources"
                                             active={location.pathname === PATH_RESOURCES_CUSTOMER}/>
                                </Fragment>
                            )}
                            {loggedIn && (
                                <Fragment>
                                    <DropDownToggle title="Accounts"
                                                    show={subNav === SUB_NAV_TYPES.accounts}
                                                    active={isPathProfile.test(location.pathname)}
                                                    onClick={() => onSetSubNav(SUB_NAV_TYPES.accounts)}/>
                                    <DropDownToggle title="Orders" show={subNav === SUB_NAV_TYPES.orders}
                                                    active={isPathOrders.test(location.pathname)}
                                                    onClick={() => onSetSubNav(SUB_NAV_TYPES.orders)}/>
                                    <NavItem path={PATH_RESOURCES_CHUMS_REPS} title="Resources"
                                             active={location.pathname === PATH_RESOURCES_CHUMS_REPS}/>
                                </Fragment>
                            )}
                        </ul>
                    </div>

                </div>
            </div>
            <NavBarSubNavContainer location={location}/>
        </div>
    );
}

export default NavBar;
