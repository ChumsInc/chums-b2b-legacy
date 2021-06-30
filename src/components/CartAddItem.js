import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import FormGroup from "../common-components/FormGroup";
import {connect} from "react-redux";
import {NEW_CART, ORDER_TYPE} from "../constants/orders";
import {saveCartItem, saveNewCart, selectCart} from '../actions/cart';
import {buildPath} from "../utils/fetch";
import {PATH_SALES_ORDER} from "../constants/paths";

class CartAddItem extends Component {

    static propTypes = {
        SalesOrderNo: PropTypes.string,
        CustomerPONo: PropTypes.string,

        saveCartItem: PropTypes.func.isRequired,
        saveNewCart: PropTypes.func.isRequired,
        selectCart: PropTypes.func.isRequired,
    };

    static defaultProps = {
        SalesOrderNo: '',
        cartName: '',
    };

    state = {
        itemCode: '',
        quantity: 1,
    };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }


    onSubmit(ev) {
        ev.preventDefault();
        const {SalesOrderNo, CustomerPONo} = this.props;
        const {itemCode, quantity} = this.state;
        if (SalesOrderNo === NEW_CART) {
            this.props.saveNewCart({cartName: CustomerPONo, itemCode, quantity})
                .then(({SalesOrderNo, Company}) => {
                    const pathProps = {
                        orderType: ORDER_TYPE.cart,
                        Company,
                        SalesOrderNo
                    };
                    this.props.selectCart({Company, SalesOrderNo}, true);
                    this.props.history.push(buildPath(PATH_SALES_ORDER, pathProps));
                });
        } else {
            this.props.saveCartItem({SalesOrderNo, ItemCode: itemCode, QuantityOrdered: quantity});
        }
    }

    render() {
        const {itemCode, quantity} = this.state;
        return (
            <form onSubmit={this.onSubmit} className="add-cart-item row g-3">
                <div className="col-auto">
                    <FormGroupTextInput field="ItemCode" value={itemCode} label="Item SKU" colWidth={8}
                                        onChange={({value}) => this.setState({itemCode: value})}/>
                </div>
                <div className="col-auto">
                    <FormGroupTextInput field="QuantityOrdered" value={quantity || ''} colWidth={8}
                                        label="Quantity" type="number" min={1}
                                        onChange={({value}) => this.setState({quantity: Number(value)})}/>

                </div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-sm btn-outline-primary" disabled={itemCode === ''}>
                        Add Item <span className="bi-bag-fill" />
                    </button>
                </div>
                <FormGroup colWidth={8}>
                </FormGroup>
            </form>
        );
    }
}

const mapStateToProps = ({salesOrder}) => {
    const {SalesOrderNo, CustomerPONo} = salesOrder.header;
    return {SalesOrderNo, CustomerPONo};
};

const mapDispatchToProps = {saveCartItem, saveNewCart, selectCart};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CartAddItem));

