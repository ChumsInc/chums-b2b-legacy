import React from 'react';
import TextInput from "../common-components/TextInput";

const CartQuantityInput = ({quantity, onChange, onAddToCart, min = 1, disabled = undefined}) => {
    return (
        <div className="row g-3">
            <div className="col">
                <div className="input-group number-input-group cart-qty-input">
                    <button type="button" className="btn btn-sm btn-outline-secondary"
                            title="decrement"
                            onClick={() => onChange(quantity - 1)} disabled={quantity <= min}>
                        <span className="bi-caret-down-fill"/>
                    </button>
                    <TextInput type="number" pattern="[1-9][0-9]*" onChange={({value}) => onChange(value)}
                               required value={quantity || (min === 0 ? 0 : '')} min={min}/>
                    <button type="button" className="btn btn-sm btn-outline-secondary"
                            title="increment"
                            onClick={() => onChange(quantity + 1)}>
                        <span className="bi-caret-up-fill" />
                    </button>
                </div>
            </div>
            <div className="col-auto">
                {/* Handle as a regular button with action */}
                {!!onAddToCart && (
                    <button type="submit" className="btn btn-sm btn-primary" disabled={disabled || quantity === 0}>
                        <span className="me-3">Add to cart</span><span className="bi-bag-fill" title="Add to cart" />
                    </button>
                )}
            </div>
        </div>
    )
};

export default CartQuantityInput;
