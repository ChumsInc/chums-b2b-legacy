import React from 'react';
import Stack from "@mui/material/Stack";
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from "@mui/material/IconButton";
import AddCommentIcon from '@mui/icons-material/AddComment';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const SalesOrderLineButtons = ({
                                   onDelete,
                                   deleteDisabled,
                                   onAddComment,
                                   addCommentDisabled,
                                   onCopyToCart,
                                   copyToCartDisabled
                               }: {
    onDelete?: () => void;
    deleteDisabled?: boolean;
    onAddComment?: () => void;
    addCommentDisabled?: boolean;
    onCopyToCart?: () => void;
    copyToCartDisabled?: boolean;
}) => {
    return (
        <Stack spacing={1} direction="column">
            {!!onDelete && (
                <IconButton type="button" size="small" color="error"
                            onClick={onDelete} disabled={deleteDisabled}>
                    <ClearIcon/>
                </IconButton>
            )}
            {!!onAddComment && (
                <IconButton type="button" size="small" color="primary"
                            onClick={onAddComment} disabled={addCommentDisabled}>
                    <AddCommentIcon/>
                </IconButton>
            )}
            {!!onCopyToCart && (
                <IconButton type="button" size="small" color="primary"
                            onClick={onCopyToCart} disabled={copyToCartDisabled}>
                    <AddShoppingCartIcon/>
                </IconButton>
            )}
        </Stack>
    )
}

export default SalesOrderLineButtons;
