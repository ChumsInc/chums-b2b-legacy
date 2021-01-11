/**
 * Created by steve on 8/10/2016.
 */

import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import SiteSearch from "./SiteSearch";
import CustomerNavbarLink from "./CustomerNavbarLink";
import CartIndicator from "./CartIndicator";
import {connect} from 'react-redux';
import {toggleXSNavBar, fetchVersion} from '../actions/app';
import Marquee from "./Marquee";
import {VERSION_REFRESH_MESSAGE} from "../constants/app";


const mapStateToProps = ({app}) => {
    const {messages} = app;
    const siteMessages = messages
        .filter(m => m.type === 'site' || m.type === 'version')
        .filter(m => m.start === null || (new Date(m.start).valueOf() < new Date().valueOf()))
        .filter(m => m.end === null || (new Date(m.end).valueOf() > new Date().valueOf()));
    return {
        messages: siteMessages
    };
};

const mapDispatchToProps = {
    toggleXSNavBar,
    // fetchVersion,
};

class HangOnBar extends Component {
    static propTypes = {
        messages: PropTypes.array,
        toggleXSNavBar: PropTypes.func.isRequired,
    };

    static defaultProps = {
        messages: [],
    };

    componentDidMount() {
        // this.props.fetchVersion();
    }

    render() {
        const {toggleXSNavBar, messages} = this.props;
        return (
            <Fragment>
                {!!messages.length && (
                    <div className="site-message">
                        <Marquee message={messages.map(m => m.message).join('; ')}/>
                    </div>
                )}
                <div className="top-bar">
                    <button className="chums-navbar-toggler" type="button" aria-label="Toggle Navigation"
                            onClick={toggleXSNavBar}>
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <ul className="navbar-nav">
                        {/*<AppGoogleLogin/>*/}
                        <li className="nav-item search">
                            <SiteSearch/>
                        </li>
                        <li className="nav-item main-logo">
                            <h1>
                                <a className="nav-link home-link" href="#">&nbsp;<span className="sr-only">Chums Inc.</span></a>
                            </h1>
                        </li>
                        <li className="nav-item cart">
                            <div className="current-customer-indicator">
                                <CustomerNavbarLink/>
                                <CartIndicator/>
                            </div>
                        </li>
                    </ul>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HangOnBar);
