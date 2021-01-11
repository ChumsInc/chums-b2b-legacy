import React from 'react';
import TextInput from "../common-components/TextInput";

const CartQuantityInput = ({quantity, onChange, onAddToCart, min = 1}) => {
    return (
        <div className="input-group input-group-sm number-input-group cart-qty-input">
            <div className="input-group-prepend">
                <button type="button" className="btn btn-sm btn-outline-secondary"
                        onClick={() => onChange(quantity - 1)} disabled={quantity <= min}>
                    <span className="material-icons">remove</span>
                </button>
            </div>
            <TextInput type="number" pattern="[1-9][0-9]*" onChange={({value}) => onChange(value)}
                       required value={quantity || (min === 0 ? 0 : '')} min={min}/>
            <div className="input-group-append">
                <button type="button" className="btn btn-sm btn-outline-secondary"
                        onClick={() => onChange(quantity + 1)}>
                    <span className="material-icons">add</span>
                </button>
            </div>
            {/* Handle as a regular button with action */}
            {!!onAddToCart && (
                <div className="input-group-append">
                    <button type="submit" className="btn btn-sm btn-primary" disabled={quantity === 0}>
                        <span className="material-icons" title="Add to cart">shopping_cart</span>
                    </button>
                </div>
            )}
        </div>
    )
};

export default CartQuantityInput;
