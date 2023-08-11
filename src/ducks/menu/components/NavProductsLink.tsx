import React from 'react';
import ListItemLink from "@/components/ListItemLink";
import {NavItemProps} from "@/types/ui-features";
import {useAppDispatch} from "@/app/configureStore";
import ProductMenu from "@/ducks/menu/components/ProductMenu";

export default function NavProductsLink({inDrawer}: NavItemProps) {
    const dispatch = useAppDispatch();
    const url = '/products'

    if (inDrawer) {
        return (
            <ListItemLink to={url} primary="Products"/>
        )
    }
    return (
        <ProductMenu/>
    )
}
