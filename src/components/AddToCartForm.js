import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CartSelect from "./CartSelect";
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import {newCart, saveCartItem, saveNewCart, setCurrentCart, updateCart} from "../actions/cart";
import FormGroup from "../common-components/FormGroup";
import CartQuantityInput from "./CartQuantityInput";
import ProgressBar from "./ProgressBar";
import Alert from "../common-components/Alert";
import {NEW_CART} from "../constants/orders";


const mapStateToProps = ({cart, carts}) => {
    const {cartNo, cartName, loading, cartMessage} = cart;
    return {
        carts,
        cartNo,
        cartName,
        loading,
        cartMessage
    };
};

const mapDispatchToProps = {
    saveNewCart,
    saveCartItem,
    selectCart: setCurrentCart,
    newCart,
    updateCart,
};


class AddToCartForm extends Component {
    static propTypes = {
        carts: PropTypes.shape({
            loading: PropTypes.bool,
            list: PropTypes.array,
        }),
        cartNo: PropTypes.string,
        cartName: PropTypes.string,
        itemCode: PropTypes.string,
        quantity: PropTypes.number,
        price: PropTypes.number,
        comment: PropTypes.string,
        loading: PropTypes.bool,
        cartMessage: PropTypes.string,
        setGlobalCart: PropTypes.bool,
        season_code: PropTypes.string,
        season_available: PropTypes.bool,
        disabled: PropTypes.bool,

        onDone: PropTypes.func.isRequired,
        onChangeQuantity: PropTypes.func.isRequired,
        selectCart: PropTypes.func.isRequired,
        saveNewCart: PropTypes.func.isRequired,
        saveCartItem: PropTypes.func.isRequired,
        newCart: PropTypes.func.isRequired,
        updateCart: PropTypes.func.isRequired,
    };

    static defaultProps = {
        carts: {
            list: [],
            loading: false,
        },
        cartNo: '',
        cartName: '',
        itemCode: '',
        quantity: 1,
        price: 0,
        comment: '',
        loading: false,
        cartMessage: '',
        setGlobalCart: false,
        season_code: '',
        season_available: false,
        disabled: false,
    };


    state = {
        comment: '',
        cartName: '',
        cartNo: '',
    };

    constructor(props) {
        super(props);
        this.onSelectCart = this.onSelectCart.bind(this);
        this.onNameCart = this.onNameCart.bind(this);
        this.onAddToCart = this.onAddToCart.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
    }

    componentDidMount() {
        const {comment, cartNo, cartName} = this.props;
        this.setState({comment, cartName, cartNo});
    }

    onSelectCart({field, value}) {
        const {cartName} = this.state;
        const {carts, setGlobalCart} = this.props;
        if (value === NEW_CART && setGlobalCart) {
            this.props.newCart();
            return;
        }
        const [cart] = carts.list.filter(so => so.SalesOrderNo === value);
        if (!!value && setGlobalCart) {
            this.props.selectCart(cart);
        }

        this.setState({
            cartNo: value,
            cartName: value === NEW_CART ? (cart.cartName || '') : cartName
        });
    }

    onNameCart({value}) {
        if (!this.props.setGlobalCart) {
            this.setState({cartName: value});
            return;
        }
        this.props.updateCart({cartName: value});
    }

    onChangeQuantity(quantity) {
        this.props.onChangeQuantity(Number(quantity));
    }

    onAddToCart(ev) {
        ev.preventDefault();
        if (this.props.disabled) {
            return;
        }
        const {itemCode, saveNewCart, saveCartItem, onDone, quantity, cartMessage, setGlobalCart, season_code, season_available, price} = this.props;
        const cartNo = setGlobalCart ? this.props.cartNo : this.state.cartNo;
        const cartName = setGlobalCart ? this.props.cartName : this.state.cartName;
        let {comment} = this.state;
        if (!!season_code && !season_available) {
            comment = [`PRE-SEASON ITEM: ${season_code}`, comment].filter(val => !!val).join('; ');
        }

        if (!!cartNo && cartNo !== NEW_CART) {
            saveCartItem({SalesOrderNo: cartNo, ItemCode: itemCode, QuantityOrdered: quantity, CommentText: comment, price});
        } else {
            saveNewCart({cartName, itemCode, quantity, comment, price});
        }
        onDone();
    }

    render() {
        const {comment} = this.state;
        const {carts, quantity, loading, cartMessage, setGlobalCart} = this.props;
        const cartNo = setGlobalCart ? this.props.cartNo : this.state.cartNo;
        const cartName = setGlobalCart ? this.props.cartName : this.state.cartName;

        return (
            <form onSubmit={this.onAddToCart} className="add-to-cart" method="post">
                <FormGroup colWidth={8} label="Select Cart">
                    <CartSelect cartList={carts.list} cartNo={cartNo} onChange={this.onSelectCart}/>
                </FormGroup>
                {(!cartNo || cartNo === NEW_CART) && (
                    <FormGroupTextInput colWidth={8} label="Cart Name" onChange={this.onNameCart} value={cartName}
                                        required helpText="Please name your cart."/>
                )}
                <FormGroup colWidth={8} label="Quantity">
                    <CartQuantityInput quantity={quantity} onChange={this.onChangeQuantity}
                                       disabled={this.props.disabled || loading}
                                       onAddToCart={this.onAddToCart}/>
                </FormGroup>
                {loading && <ProgressBar striped height={10}/>}
                {!!cartMessage && <Alert type="alert-success">{cartMessage}</Alert>}
            </form>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToCartForm) 
