import React from 'react';
import {NavItem} from "@/types/ui-features";
import NavLoginLink from "@/ducks/menu/components/NavLoginLink";
import NavProductsLink from "@/ducks/menu/components/NavProductsLink";
import NavSignupLink from "@/ducks/menu/components/NavSignupLink";
import NavAccountsLink from "@/ducks/menu/components/NavAccountsLink";
import NavOrdersLink from "@/ducks/menu/components/NavOrdersLink";
import NavResourcesLink from "@/ducks/menu/components/NavResourcesLink";

export const navItems: NavItem[] = [
    {id: 'products', render: NavProductsLink},
    {id: 'login', render: NavLoginLink},
    {id: 'signup', render: NavSignupLink},
    {id: 'accounts', render: NavAccountsLink},
    {id: 'orders', render: NavOrdersLink},
    {id: 'resources', render: NavResourcesLink},
];

