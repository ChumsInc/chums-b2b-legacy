import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {PATH_SALES_ORDER} from "../constants/paths";
import {Link} from "react-router-dom";
import {buildPath} from "../utils/fetch";
import numeral from 'numeral';
import {ORDER_TYPE} from "../constants/orders";
import ProgressBar from "./ProgressBar";




const mapStateToProps = ({user, cart}) => {
    const {loggedIn} = user;
    const {Company} = user.currentCustomer;
    const {cartNo, cartName, cartTotal, cartQuantity, loading} = cart;
    return {
        loggedIn,
        Company,
        cartNo,
        cartName,
        cartTotal,
        cartQuantity,
        loading,
    };
};

const mapDispatchToProps = {
};

class CartIndicator extends Component {
    static propTypes = {
        loggedIn: PropTypes.bool,
        Company: PropTypes.string,
        cartNo: PropTypes.string,
        cartName: PropTypes.string,
        cartTotal: PropTypes.number,
        cartQuantity: PropTypes.number,
        loading: PropTypes.bool,
    };

    static defaultProps = {
        loggedIn: false,
        Company: 'chums',
        cartNo: '',
        cartName: '',
        cartTotal: 0,
        cartQuantity: 0,
        loading: false,
    };

    render() {
        const {loggedIn, Company, cartNo, cartName, cartTotal, cartQuantity, loading} = this.props;
        if (!loggedIn) {
            return (
                <div className="nav-link mx-3 cart-icon">
                    <span className="bi-person-square" />
                </div>
            );
        }

        const path = !!cartNo
            ? buildPath(PATH_SALES_ORDER, {orderType: ORDER_TYPE.cart, Company, SalesOrderNo: cartNo})
            : null;
        return !!cartNo
            ? (
                <Link to={path} className="nav-link cart-icon">
                    <div>
                        {!!cartName && (<span className="cart-name ms-1">"{cartName}"</span>)}
                        <span className="bi-bag-fill ms-1" title={cartName} />
                        {!!cartQuantity && <span className="ms-1">({numeral(cartQuantity).format('0,0')})</span>}
                        {!!cartTotal && (<span className="ms-1">{numeral(cartTotal).format('$0,0.00')}</span>)}
                    </div>
                    {loading && <ProgressBar striped={true} style={{height: '1px', fontSize: 0}} />}
                </Link>
            )
            : (
                <div className="nav-link mx-3 text-warning" title="No cart!">
                    <span className="bi-bag" />
                </div>
            );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartIndicator);
