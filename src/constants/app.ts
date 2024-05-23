export const VERSION_REFRESH_MESSAGE = 'An minor update is available. Please refresh your browser when convenient.';
export const VERSION_REFRESH_TIMEOUT = 1000 * 60 * 60; // 30 minutes.

export const SUB_NAV_TYPES = {
    none: '',
    products: 'products',
    accounts: 'accounts',
    orders: 'orders',
    resources: 'resources',
};

export interface CustomerTab {
    id: number;
    title: string;
    path?: string;
}

export const CUSTOMER_TABS:CustomerTab[] = [
    {id: 1, title: 'Billing Address'},
    {id: 2, title: 'Delivery Addresses'},
    // {id: 3, title: 'Contacts'},
    {id: 3, title: 'Users'},
    {id: 5, title: 'Carts', path: '/orders/cart'},
    {id: 6, title: 'Open Orders', path: '/orders/cart'},
    {id: 7, title: 'Invoices', path: '/orders/invoices'},
];

export const AUTH_LOCAL = 'AUTH_LOCAL';
export const AUTH_GOOGLE = 'AUTH_GOOGLE';

export const USER_EXISTS = 'USER_EXISTS';

export const GOOGLE_CLIENT_ID = "949305513396-8tmadc840cuabrda5ucvs171be1ups1e.apps.googleusercontent.com";
