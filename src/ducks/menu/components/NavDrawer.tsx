import React from 'react';
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import {useAppDispatch} from "../../../app/configureStore";
import {useSelector} from "react-redux";
import {selectIsDrawerOpen, toggleMenuDrawer} from "../index";

const drawerWidth = 240;

interface NavDrawerProps {
    children: React.ReactNode;
}
const NavDrawer = ({children}:NavDrawerProps) => {
    const dispatch = useAppDispatch();
    const isOpen = useSelector(selectIsDrawerOpen);

    const closeHandler = () => {
        dispatch(toggleMenuDrawer());
    }
    if (typeof window === 'undefined') {
        return null;
    }
    return (
        <Box component="nav">
            <Drawer container={window?.document?.body} variant="temporary" open={isOpen}
                    anchor="top"
                    onClose={closeHandler}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth, maxWidth: '75vw'},
                    }}>
                {children}
            </Drawer>
        </Box>
    )
}
export default NavDrawer;
