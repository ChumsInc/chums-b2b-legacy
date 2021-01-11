import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ModalAlert from "./ModalAlert";
import AddToCartForm from "./AddToCartContainer";


export default class AddToCartModal extends Component {
    static propTypes = {
        itemCode: PropTypes.string,
        quantity: PropTypes.number,
        comment: PropTypes.string,

        onClose: PropTypes.func,
    };

    static defaultProps = {
        itemCode: '',
        quantity: 0,
        comment: '',
    };

    render() {
        const {itemCode, quantity, comment} = this.props;
        return (
            <ModalAlert title="Add to Cart" onClose={this.props.onClose} size="sm">
                <AddToCartForm onClose={this.props.onClose}
                               itemCode={itemCode} quantity={quantity} comment={comment} />
            </ModalAlert>
        );
    }

}

