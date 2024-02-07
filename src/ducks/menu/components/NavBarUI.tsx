import React, {Fragment, useEffect,} from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HideOnScroll from "../../../components/HideOnScroll";
import Divider from '@mui/material/Divider';
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import NavDrawer from "./NavDrawer";
import HomeLink from "./HomeLink";
import {navItems} from './NavItems'
import {useAppDispatch} from "../../../app/configureStore";
import {useSelector} from "react-redux";
import {loadProductMenu, selectLoaded, selectLoading, toggleMenuDrawer} from "../index";
import Container from "@mui/material/Container";
import UserMenu from "./UserMenu";
import CartMenu from "./CartMenu";
import SearchBar from "../../search/components/SearchBar";

const drawerWidth = 240;
// const navItems = ['Products', 'Accounts', 'Orders', 'Resources'];


const NavBarUI = () => {
    const dispatch = useAppDispatch();
    const loading = useSelector(selectLoading);
    const loaded = useSelector(selectLoaded);

    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadProductMenu());
        }
    }, []);

    const handleDrawerToggle = () => {
        dispatch(toggleMenuDrawer());
    }

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
            <HomeLink sx={{display: {xs: 'block', md: 'none'}}}/>
            <Divider/>
            <List>
                {navItems.map((item) => (
                    <Fragment key={item.id}>
                        {item.title ?? (!!item.render ? item.render({inDrawer: true}) : null)}
                    </Fragment>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <HideOnScroll>
                <AppBar component="nav" color="default">
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <IconButton color="inherit" aria-label="open drawer" edge="start"
                                        onClick={handleDrawerToggle}
                                        sx={{mr: 2, display: {md: 'none'}}}>
                                <MenuIcon/>
                            </IconButton>
                            <HomeLink/>
                            <Box sx={{display: {xs: 'none', md: 'flex'}, flex: '1 1 auto', flexDirection: 'row', alignItems: 'center'}}>
                                {navItems.map((item) => (
                                    <Fragment key={item.id}>
                                        {item.title ?? (!!item.render ? item.render({}) : null)}
                                    </Fragment>
                                ))}
                            </Box>
                            <Box sx={{display: {xs: 'none', md: 'flex'}, flex: '1 1 auto'}}>
                                <SearchBar />
                            </Box>
                            <Stack spacing={2} direction="row" useFlexGap >
                                <CartMenu />
                                <UserMenu/>
                            </Stack>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>
            <Toolbar />
            <NavDrawer>
                {drawer}
            </NavDrawer>
        </div>

    )
}

export default NavBarUI;
