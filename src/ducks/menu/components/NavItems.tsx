import {NavItem} from "../../../types/ui-features";
import NavLoginLink from "./NavLoginLink";
import NavProductsLink from "./NavProductsLink";
import NavSignupLink from "./NavSignupLink";
import NavAccountsLink from "./NavAccountsLink";
import NavOrdersLink from "./NavOrdersLink";
import NavResourcesLink from "./NavResourcesLink";

export const navItems: NavItem[] = [
    {id: 'products', render: NavProductsLink},
    {id: 'login', render: NavLoginLink},
    {id: 'signup', render: NavSignupLink},
    {id: 'accounts', render: NavAccountsLink},
    {id: 'orders', render: NavOrdersLink},
    {id: 'resources', render: NavResourcesLink},
    // {id: 'search', render: SearchBar}
];

