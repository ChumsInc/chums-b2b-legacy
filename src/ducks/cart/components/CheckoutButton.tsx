import React from 'react';
import {
    CartProgress,
    cartProgress_Cart,
    cartProgress_Confirm,
    cartProgress_Delivery,
    cartProgress_Payment
} from "../../../types/cart";
import Button, {ButtonProps} from "@mui/material/Button";

export interface CheckoutButtonProps extends ButtonProps {
    cartProgress: CartProgress;
}
export default function CheckoutButton({cartProgress, type, ...buttonProps}: CheckoutButtonProps) {
    const buttonText = () => {
        switch (cartProgress) {
            case cartProgress_Cart:
                return 'Begin Checkout';
            case cartProgress_Delivery:
                return 'Confirm Delivery & Shipping';
            case cartProgress_Payment:
                return 'Confirm Payment';
            default:
                return 'Submit Order';
        }
    }
    return (
        <Button type={type ?? 'button'} variant={cartProgress === cartProgress_Confirm ? 'contained' : "outlined"}
                {...buttonProps}>
            {buttonText()}
        </Button>
    )
}
