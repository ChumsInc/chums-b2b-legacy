import React from 'react';
import Stack from "@mui/material/Stack";
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from "@mui/material/IconButton";
import AddCommentIcon from '@mui/icons-material/AddComment';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {SpeedDial, SpeedDialAction} from "@mui/material";
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Box from "@mui/material/Box";

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
    const actions = [
        {icon:<AddShoppingCartIcon/>, name: 'Add to Cart', disabled: !onCopyToCart || deleteDisabled },
        {icon: <AddCommentIcon/>, name: 'Add Comment', disabled: !onAddComment || addCommentDisabled},
        {icon: <ClearIcon color="error"/>, name: 'Remove From Cart', disabled: !onDelete || copyToCartDisabled},
    ]
    return (
        <Box sx={{position: 'relative', height: 'calc(0.5rem + 80px + 24px)'}}>
            <SpeedDial ariaLabel="Cart Item Actions" icon={<SpeedDialIcon />}
                       direction="left"
                       sx={{position: "absolute", bottom: 8, right: 0}}>
                {actions.filter(action => !action.disabled).map(action => (
                    <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} />
                ))}
            </SpeedDial>
        </Box>
    )
}

export default SalesOrderLineButtons;
