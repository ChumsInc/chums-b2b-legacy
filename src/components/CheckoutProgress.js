import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {setCartProgress} from "../ducks/cart/actions";
import {CART_PROGRESS_NAMES, CART_PROGRESS_STATES} from "../constants/orders";
import ProgressBar from "./ProgressBar";
import classNames from 'classnames';

class CheckoutProgress extends Component {
    static propTypes = {
        cartProgress: PropTypes.number,
        setCartProgress: PropTypes.func.isRequired,
    };

    state = {
        maxProgress: CART_PROGRESS_STATES.cart
    };

    constructor(props) {
        super(props);
        this.setProgress = this.setProgress.bind(this);
    }

    componentDidMount() {
        this.setState({
            maxProgress: this.props.cartProgress
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.cartProgress > this.state.maxProgress) {
            this.setState({maxProgress: this.props.cartProgress});
        }
    }

    setProgress(level) {
        if (level <= this.state.maxProgress) {
            this.props.setCartProgress(level);
        }
    }


    render() {
        const {cartProgress} = this.props;
        const {maxProgress} = this.state;
        const levels = Object.keys(CART_PROGRESS_STATES).length;
        const progress = levels === 0 ? 0 : cartProgress / levels;
        let value = levels === 0 ? 0 : (progress * 100) + ( 100 / levels / 2);
        return (
            <div className="order-progress-bar">
                <ProgressBar striped={false} value={value} />
                <div className="order-states">
                    {Object.keys(CART_PROGRESS_STATES)
                        .map(key => {
                            return (<div key={key} className={classNames({disabled: CART_PROGRESS_STATES[key] > maxProgress})}
                                         onClick={() => this.setProgress(CART_PROGRESS_STATES[key])}>
                                {CART_PROGRESS_NAMES[key]}
                            </div>)
                        })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({cart}) => {
    const {cartProgress} = cart;
    return {cartProgress};
};

const mapDispatchToProps = {
    setCartProgress
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutProgress) 
