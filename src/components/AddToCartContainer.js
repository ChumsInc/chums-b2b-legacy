import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getItemAvailability} from "../actions/cart";
import {itemPrice} from "../utils/customer";
import CartItemInfo from "./CartItemInfo";
import CartItemDetail from "./CartItemDetail";
import AddToCartForm from "./AddToCartForm";
import Alert from "../common-components/Alert";
import MissingTaxScheduleAlert from "./MissingTaxScheduleAlert";



class AddToCartContainer extends Component {
    static propTypes = {
        itemCode: PropTypes.string,
        quantity: PropTypes.number,
        customerPrice: PropTypes.number,
        comment: PropTypes.string,
        itemAvailability: PropTypes.object,
        TaxSchedule: PropTypes.string,

        getItemAvailability: PropTypes.func,
        onClose: PropTypes.func,
    };

    static defaultProps = {
        itemCode: '',
        quantity: 0,
        customerPrice: 0,
        comment: '',
        itemAvailability: {},
    };

    state = {
        quantity: 1,
    };

    constructor(props) {
        super(props);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
    }

    componentDidMount() {
        const {itemCode, itemAvailability, getItemAvailability, quantity} = this.props;
        this.setState({quantity});
        if (itemCode !== itemAvailability.ItemCode) {
            getItemAvailability({ItemCode: itemCode});
        }
    }

    onChangeQuantity(quantity) {
        this.setState({quantity});
    }

    render() {
        const {itemAvailability, customerPrice, itemCode, comment, TaxSchedule} = this.props;
        const {quantity} = this.state;
        const {
            ItemCode, ItemCodeDesc, SalesUnitOfMeasure, StandardUnitOfMeasure, SuggestedRetailPrice,
            SalesUMConvFactor = 1, QuantityAvailable
        } = itemAvailability;
        return (
            <Fragment>
                <div className="my-3">
                    <CartItemInfo ItemCode={ItemCode} ItemCodeDesc={ItemCodeDesc}/>
                </div>
                {!TaxSchedule && (<MissingTaxScheduleAlert />)}
                <AddToCartForm itemCode={itemCode} quantity={quantity} comment={comment}
                               onChangeQuantity={this.onChangeQuantity}
                               onDone={() => this.props.onClose()}/>
                <CartItemDetail itemCode={ItemCode} quantity={quantity}
                                QuantityAvailable={QuantityAvailable}
                                price={customerPrice}
                                salesUM={SalesUnitOfMeasure} salesUMFactor={SalesUMConvFactor}
                                stdUM={StandardUnitOfMeasure} msrp={SuggestedRetailPrice} />
            </Fragment>
        );
    }

}

const mapStateToProps = ({cart, customer}) => {
    const {itemAvailability} = cart;
    const {pricing} = customer;
    const {TaxSchedule} = customer.account;
    const {ItemCode, PriceCode, StandardUnitPrice} = itemAvailability;
    const customerPrice = itemPrice({pricing, itemCode: ItemCode, priceCode: PriceCode, stdPrice: StandardUnitPrice});
    return {
        itemAvailability,
        customerPrice,
        TaxSchedule,
    };
};

const mapDispatchToProps = {
    getItemAvailability,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToCartContainer);
