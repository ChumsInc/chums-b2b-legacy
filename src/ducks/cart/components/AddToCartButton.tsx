import React from 'react';
import Button, {ButtonProps} from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function AddToCartButton({disabled, children, ...rest}:ButtonProps) {
    return (
        <Button color="primary" variant="contained" type="submit" size="small"
                fullWidth disabled={disabled} endIcon={<ShoppingCartIcon />} {...rest}>
            {children ?? 'Add to Cart'}
        </Button>
    )
}
