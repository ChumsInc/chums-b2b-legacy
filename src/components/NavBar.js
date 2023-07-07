/**
 * Created by steve on 8/31/2016.
 */

import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {PATH_LOGIN, PATH_RESOURCES_CHUMS_REPS, PATH_RESOURCES_CUSTOMER, PATH_SIGNUP} from '../constants/paths';
import {setSubNavBar} from '../actions/app';
import DropDownToggle from "./DropDownToggle";
import {SUB_NAV_TYPES} from "../constants/app";
import NavBarSubNavContainer from "./NavBarSubNavContainer";
import {withRouter} from "react-router";
import {selectVersionChanged} from "../ducks/version";
import {selectHasMessages} from "../ducks/messages";


const NavItem = ({path, title = '', active = false}) => {
    return (
        <li className={classNames("nav-item", {active: active})}>
            <Link to={path} className="nav-link">{title}</Link>
        </li>
    )
};


const isPathProducts = new RegExp(`^/products`);
const isPathProfile = new RegExp(`^/(profile|account)`);
const isPathOrders = new RegExp('^/orders');

const mapStateToProps = (state) => {
    const {app, user} = state;
    const versionChanged = selectVersionChanged(state);
    const hasMessages = selectHasMessages(state);
    const {subNav, showNavBar, search} = app;
    const hideForSearch = search.show;
    const {loggedIn, accounts} = user;
    return {showNavBar, subNav, loggedIn, accounts, hasMessages, hideForSearch};
};

const mapDispatchToProps = {
    setSubNavBar,
};

class NavBar extends Component {
    static propTypes = {
        location: PropTypes.object,
        showNavBar: PropTypes.bool,
        subNav: PropTypes.string,
        loggedIn: PropTypes.bool.isRequired,
        hasMessages: PropTypes.bool,
        hideForSearch: PropTypes.bool,
    };

    static defaultProps = {
        loggedIn: false,
        showNavBar: false,
        subNav: SUB_NAV_TYPES.none,
        location: {
            pathname: '',
        },
        hasMessages: false,
        hideForSearch: false,
    };

    state = {
        expanded: false,
        scrolled: false,
        subNav: '',
    };

    constructor(props) {
        super(props);
        this.onScroll = this.onScroll.bind(this);
        this.onSetSubNav = this.onSetSubNav.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.subNav !== '' && this.props.location.pathname !== prevProps.location.pathname) {
            this.setState({subNav: ''});
        }
        if (this.state.scrolled && document.querySelector('body.scrolled') === null) {
            document.querySelector('body').classList.add('scrolled');
        } else if (!this.state.scrolled && document.querySelector('body.scrolled')) {
            document.querySelector('body.scrolled').classList.remove('scrolled');
        }
    }

    onScroll() {
        const {scrolled, expanded} = this.state;
        if (window.scrollY > 30 && !scrolled) {
            this.setState({scrolled: true});
        } else if (window.scrollY <= 30 && scrolled) {
            this.setState({scrolled: false});
        }
    }

    onExpand() {
        this.setState({expanded: !this.state.expanded});
    }

    onSetSubNav(subNav) {
        if (this.props.subNav !== subNav) {
            this.props.setSubNavBar(subNav);
        } else {
            this.props.setSubNavBar(SUB_NAV_TYPES.none);
        }
    }

    render() {
        const {showNavBar, loggedIn, location, subNav, hasMessages, hideForSearch} = this.props;
        const {scrolled} = this.state;
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
                                                onClick={() => this.onSetSubNav(SUB_NAV_TYPES.products)}/>
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
                                                        onClick={() => this.onSetSubNav(SUB_NAV_TYPES.accounts)}/>
                                        <DropDownToggle title="Orders" show={subNav === SUB_NAV_TYPES.orders}
                                                        active={isPathOrders.test(location.pathname)}
                                                        onClick={() => this.onSetSubNav(SUB_NAV_TYPES.orders)}/>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
