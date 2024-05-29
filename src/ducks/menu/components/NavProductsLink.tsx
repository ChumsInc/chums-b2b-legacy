import React, {useState} from 'react';
import ListItemLink from "../../../components/ListItemLink";
import {NavItemProps} from "../../../types/ui-features";
import ProductMenu from "./ProductMenu";
import Collapse from "@mui/material/Collapse";
import ListItemButton from "@mui/material/ListItemButton";
import {useSelector} from "react-redux";
import {selectProductMenu} from "../index";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import List from "@mui/material/List";

const productUrl = (url: string) => `/products${url}`;

export default function NavProductsLink({inDrawer}: NavItemProps) {
    const [show, setShow] = useState(false);
    const productMenu = useSelector(selectProductMenu);

    const clickHandler = (ev: React.MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        setShow(!show);
    }
    if (inDrawer) {
        return (
            <>
                <ListItemButton onClick={clickHandler}>
                    <ListItemText primary="Products"/>
                    {show ? <ExpandLess/> : <ExpandMore/>}
                </ListItemButton>
                <Collapse in={show}>
                    <List component="div" disablePadding>
                        {productMenu?.items?.map(item => (
                            <ListItemLink sx={{pl: 4}} key={item.id} primary={item.title} to={productUrl(item.url)}/>
                        ))}
                    </List>
                </Collapse>
                {show && <Divider sx={{my: '0.5rem'}}/>}
            </>

        )
    }
    return (
        <ProductMenu/>
    )
}
