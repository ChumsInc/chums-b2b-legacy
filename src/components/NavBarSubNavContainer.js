import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ProductSubNav from "./ProductSubNav";
import {SUB_NAV_TYPES} from "../constants/app";
import {setSubNavBar} from "../ducks/app/actions";
import AccountSubNav from "./AccountSubNav";
import OrdersSubNav from "@/ducks/menu/components/OrdersSubNav";
import ResourcesSubNav from "./ResourcesSubNav";

class NavBarSubNavContainer extends Component {
    static propTypes = {
        subNav: PropTypes.string,
        loggedIn: PropTypes.bool,
        location: PropTypes.object,
        setSubNavBar: PropTypes.func.isRequired,
    };

    static defaultProps = {
        subNav: SUB_NAV_TYPES.none,
        loggedIn: false,
        location: {
            pathname: '',
        },
    };

    state = {
        show: false,
    };


    constructor(props) {
        super(props);
        this.onClickOutside = this.onClickOutside.bind(this);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onClickOutside);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {subNav, location} = this.props;

        // remove the listener if subnav is not visible
        if (subNav === SUB_NAV_TYPES.none) {
            document.removeEventListener('click', this.onClickOutside);
            return;
        }

        // set subnav to not visible if route has changed
        if (location.pathname !== prevProps.location.pathname) {
            this.props.setSubNavBar(SUB_NAV_TYPES.none);
            return;
        }

        // add the listener if the sub-navbar is now visible
        if (prevProps.subNav === SUB_NAV_TYPES.none) {
            document.addEventListener('click', this.onClickOutside);
        }
    }


    onClickOutside(ev) {
        // check if the click is on the current link
        const a = ev.target.closest('a');
        if (a && a.href === document.location.href) {
            this.props.setSubNavBar(SUB_NAV_TYPES.none);
            return;
        }
        // check if the click is in the nav elements
        if (ev.target.closest('.chums-navbar-container')) {
            return;
        }

        this.props.setSubNavBar(SUB_NAV_TYPES.none);
    }


    render() {
        const {subNav, loggedIn} = this.props;

        return !!subNav
            ? (
                <div className="chums-subnavbar">
                    {subNav === SUB_NAV_TYPES.products && <ProductSubNav/>}
                    {subNav === SUB_NAV_TYPES.accounts && <AccountSubNav/>}
                    {subNav === SUB_NAV_TYPES.orders && <OrdersSubNav/>}
                    {subNav === SUB_NAV_TYPES.resources && <ResourcesSubNav loggedIn={loggedIn}/>}
                </div>
            )
            : null;
    }
}

const mapStateToProps = ({app, user}) => {
    const {subNav} = app;
    const {loggedIn} = user;
    return {subNav, loggedIn};
};

const mapDispatchToProps = {
    setSubNavBar,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBarSubNavContainer);
