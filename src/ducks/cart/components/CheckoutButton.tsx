import React from 'react';
import {CartProgress, cartProgress_Cart, cartProgress_Delivery, cartProgress_Payment} from "@/types/cart";
import {Button} from "@mui/material";

export default function CheckoutButton({cartProgress}: {
    cartProgress: CartProgress;
}) {
    const buttonText = () => {
        switch (cartProgress) {
            case cartProgress_Cart:
                return 'Begin Checkout';
            case cartProgress_Delivery:
                return 'Confirm Delivery & Shipping';
            case cartProgress_Payment:
                return 'Confirm Payment';
            default:
                return 'Submit';
        }
    }
    return (
        <Button type="submit" variant="outlined">
            {buttonText()}
        </Button>
    )
}
