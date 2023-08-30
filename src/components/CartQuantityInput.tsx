import React from 'react';

const CartQuantityInput = ({quantity, onChange, min = 1, disabled, required}: {
    quantity: number;
    onChange: (value: number) => void;
    min?: number;
    disabled?: boolean;
    required?: boolean;
}) => {
    return (
        <div className="input-group input-group-sm number-input-group cart-qty-input">
            <button type="button" className="btn btn-sm btn-outline-secondary"
                    title="decrement"
                    onClick={() => onChange(quantity - 1)} disabled={disabled || quantity <= min}>
                <span className="bi-caret-down-fill"/>
            </button>
            <input type="number" className="form-control sm" pattern="[1-9][0-9]*"
                   onChange={(ev) => onChange(ev.target.valueAsNumber)}
                   required={required} disabled={disabled}
                   value={quantity || (min === 0 ? 0 : '')} min={min}/>
            <button type="button" className="btn btn-sm btn-outline-secondary"
                    title="increment"
                    disabled={disabled}
                    onClick={() => onChange(quantity + 1)}>
                <span className="bi-caret-up-fill"/>
            </button>
        </div>
    )
};

export default CartQuantityInput;
