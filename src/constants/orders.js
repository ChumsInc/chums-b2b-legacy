export const cartProcess = ['cart', 'delivery', 'payment', 'confirm'];

export const CART_PROGRESS_STATES = {
    cart: 0,
    delivery: 1,
    payment: 2,
    confirm: 3
};

export const CART_PROGRESS_NAMES = {
    cart: 'Cart',
    delivery: 'Shipping & Delivery',
    payment: 'Payment',
    confirm: 'Confirm',
};

export const cartProgressStates = {
    cart: {state: CART_PROGRESS_STATES.cart, name: CART_PROGRESS_NAMES.cart},
    delivery: {state: CART_PROGRESS_STATES.delivery, name: CART_PROGRESS_NAMES.delivery},
    payment: {state: CART_PROGRESS_STATES.payment, name: CART_PROGRESS_NAMES.payment},
    confirm: {state: CART_PROGRESS_STATES.confirm, name: CART_PROGRESS_NAMES.confirm},
};


export const ORDER_TYPE = {
    cart: 'cart',
    open: 'open',
    past: 'past',
    master: 'master',
    invoices: 'invoices',
};

export const ORDER_TYPE_NAMES = {
    cart: 'Carts',
    open: 'Open Orders',
    past: 'Previous Orders',
    master: 'Master Orders',
    invoices: 'Invoices',
};

export const NEW_CART = 'new';

export const PRICE_LEVELS = {
    1: 'Wholesale 100 Pc',
    2: 'Wholesale 200 Pc',
    5: 'Wholesale 500 Pc',
    A: 'Distributor 5000 Pc',
    B: 'Distributor 10000 Pc',
    C: 'Distributor 20000 Pc',
    N: 'Safety DNS',
    S: 'Safety DSS',
    M: 'Safety DSM',
    L: 'Safety DSL',
    G: 'Safety GOV',
    X: 'International 5000',
    Y: 'International 10000',
    Z: 'International 20000',
};
