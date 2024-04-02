import React from 'react';
import {
    CartProgress,
    cartProgress_Cart,
    cartProgress_Confirm,
    cartProgress_Delivery,
    cartProgress_Payment
} from "../../../types/cart";
import Box from "@mui/material/Box";
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Unstable_Grid2'
import Button from '@mui/material/Button'


export default function CartCheckoutProgress({current, disabled, onChange}: {
    current: CartProgress;
    disabled?: boolean;
    onChange: (next: CartProgress) => void;
}) {
    const levels = 4;
    const progress = current / (cartProgress_Confirm + 1);
    const value = (progress * 100) + (100 / levels / 2);
    const changeHandler = (next: CartProgress) => {
        if (!disabled) {
            onChange(next);
        }
    }
    return (
        <Box sx={{width: '100%', mb: 1, mt: 2}} >
            <LinearProgress variant="determinate" value={value} />
            <Grid container spacing={1}>
                <Grid xs={3} sx={{textAlign: 'center'}}>
                    <Button type="button"
                            size="small"
                            disabled={disabled}
                            onClick={() => changeHandler(cartProgress_Cart)}>Cart</Button>
                </Grid>
                <Grid xs={3} sx={{textAlign: 'center'}}>
                    <Button type="button" disabled={disabled || current < cartProgress_Delivery}
                            size="small"
                            onClick={() => changeHandler(cartProgress_Delivery)}>
                        Shipping & Delivery
                    </Button>
                </Grid>
                <Grid xs={3} sx={{textAlign: 'center'}}>
                    <Button type="button" disabled={disabled || current < cartProgress_Payment}
                            size="small"
                            onClick={() => changeHandler(cartProgress_Payment)}>
                        Payment
                    </Button>
                </Grid>
                <Grid xs={3} sx={{textAlign: 'center'}}>
                    <Button type="button" disabled={disabled || current < cartProgress_Confirm}
                            size="small"
                            onClick={() => changeHandler(cartProgress_Confirm)}>
                        Confirm
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}
