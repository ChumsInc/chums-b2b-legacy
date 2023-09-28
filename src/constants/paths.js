/*
For any paths that use a query string, the question mark needs to be escaped for the parameters in the
query string to be replaced:
For Example - the following url will compile as below:
    FROM: '/sage/b2b/billto.php\\?co=:Company&account=:ARDivisionNo-:CustomerNo'
    TO: '/sage/b2b/billto.php?co=CHI&account=01-TEST'
 */
export const PATH_CATEGORY = '/products/:category';
export const PATH_CUSTOMER_ACCOUNT = '/account/:customerSlug';
export const PATH_CUSTOMER_DELIVERY_LIST = '/account/:customerSlug/delivery';
export const PATH_CUSTOMER_DELIVERY = '/account/:customerSlug/delivery/:code';
export const PATH_HOME = '/home';
export const PATH_LOGIN = '/login';
export const PATH_LOGOUT = '/logout';
export const PATH_RESOURCES_CHUMS_REPS = '/pages/chums-reps';
export const PATH_RESOURCES_BC_REPS = '/pages/bc-reps';
export const PATH_RESOURCES_CUSTOMER = '/pages/customer-resources';
export const PATH_PAGE = '/pages/:keyword';
export const PATH_PAGE_RESOURCES = '/pages/customer-resources';
export const PATH_PAGE_REP_RESOURCES = '/pages/rep-resources';
export const PATH_PRODUCT = '/products/:category/:product?';
export const PATH_PRODUCT_WITHOUT_PARENT = '/products/:product';
export const PATH_PRODUCT_HOME = '/products/eyewear-retainers';
export const PATH_PRODUCT_HOME_BC = '/products/active-formula-sunscreen';
export const PATH_PRODUCTS = '/products';
export const PATH_PROFILE = '/profile';
export const PATH_PROFILE_ACCOUNT = '/profile/:id';
export const PATH_SALES_ORDERS = '/orders/:orderType';
export const PATH_CART_CHECKOUT = '/orders/cart/:Company/:SalesOrderNo';
export const PATH_SALES_ORDER = './:orderType/:salesOrderNo';
export const PATH_SALES_ORDER_OPEN = '/orders/open/:Company/:SalesOrderNo';
export const PATH_SALES_ORDER_PAST = '/orders/past/:Company/:SalesOrderNo';
export const PATH_SALES_ORDER_MASTER = '/orders/master/:Company/:SalesOrderNo';
export const PATH_SALES_ORDER_INVOICES = '/orders/invoices/:Company/:SalesOrderNo';
export const PATH_INVOICE = '/account/:customerSlug/invoices/:invoiceType/:invoiceNo';
export const PATH_SALES_ORDER_BREADCRUMB = '/orders/:orderType?/:Company?/:SalesOrderNo?';
export const PATH_INVOICE_BREADCRUMB = '/orders/:orderType?/:Company?/:SalesOrderNo?';
export const PATH_SIGNUP = '/signup';
export const PATH_SET_PASSWORD = '/set-password';


export const CONTENT_PATH_SEARCH_IMAGE = '/images/products/80/:image';
export const CONTENT_PATH_PRODUCT_IMAGE = '/images/products/:size/:image';
export const CONTENT_PATH_PRODUCT_MISSING_IMAGE = '/images/generic/1px.png';
export const CONTENT_PATH_SWATCH = '/:path/:color.:filetype';

// user paths
export const API_PATH_LOGIN_GOOGLE = '/api/user/b2b/login/google'
export const API_PATH_LOGIN_LOCAL = '/api/user/b2b/login/local';
export const API_PATH_LOGIN_LOCAL_REAUTH = '/api/user/b2b/auth/update';
export const API_PATH_LOGOUT = '/api/user/b2b/logout';
export const API_PATH_PASSWORD_RESET = '/api/user/b2b/login/reset-password';
export const API_PATH_PROFILE = '/api/user/b2b/profile';
export const API_PATH_CHANGE_PASSWORD = '/api/user/b2b/password';
export const API_PATH_USER_SET_PASSWORD = '/api/user/b2b/signup/:authHash/:authKey';
export const API_PATH_USER_SIGN_UP = '/api/user/b2b/signup/:email';
export const API_PATH_HOME_SLIDES = '/api/features/slides/active';

// account and account list paths
export const API_PATH_ACCOUNT_USER = '/api/user/b2b/users/:Company/:ARDivisionNo-:CustomerNo/:id';
export const API_PATH_ACCOUNT_USERS = '/api/user/b2b/users/:Company/:ARDivisionNo-:CustomerNo';
export const API_PATH_CUSTOMER = '/api/sales/b2b/account/:Company/:ARDivisionNo-:CustomerNo';
export const API_PATH_CUSTOMER_LIST = '/api/sales/b2b/account-list/:Company/:SalespersonDivisionNo-:SalespersonNo';
export const API_PATH_REP_LIST = '/api/sales/rep/list/chums/condensed';
export const API_PATH_SAVE_ADDRESS = '/sage/b2b/billto.php\\?co=:Company&account=:ARDivisionNo-:CustomerNo';
export const API_PATH_SAVE_SHIPTO_ADDRESS = '/sage/b2b/shipto.php\\?co=:Company&account=:ARDivisionNo-:CustomerNo-:ShipToCode';
export const API_PATH_SET_PRIMARY_SHIPTO = '/sage/b2b/set-primary-shipto.php\\?co=:Company';

// cart and order paths
export const API_PATH_CART_IMAGE = '/api/images/products/find/80/:ItemCode';
export const API_PATH_DELETE_CART = '/sage/b2b/cart-quote.php\\?co=:Company&account=:ARDivisionNo-:CustomerNo';
export const API_PATH_OPEN_ORDERS = '/node-sage/api/:Company/salesorder/:ARDivisionNo-:CustomerNo/open';
export const API_PATH_PAST_ORDERS = '/api/sales/b2b/invoices/:Company/:ARDivisionNo-:CustomerNo';
export const API_PATH_INVOICES = '/api/sales/b2b/invoices/:Company/:ARDivisionNo-:CustomerNo';
export const API_PATH_PROMOTE_CART = '/sage/b2b/cart-quote.php\\?co=:Company&account=:ARDivisionNo-:CustomerNo-:ShipToCode?';
export const API_PATH_SALES_ORDER = '/node-sage/api/:Company/salesorder/:ARDivisionNo-:CustomerNo/:SalesOrderNo';
export const API_PATH_INVOICE = '/api/sales/invoice/:Company/:InvoiceType/:InvoiceNo';
export const API_PATH_SAVE_CART = '/sage/b2b/cart-quote.php\\?co=:Company&account=:ARDivisionNo-:CustomerNo';
export const API_PATH_CART_ACTION = '/sage/b2b/cart-quote.php\\?co=:Company&account=:ARDivisionNo-:CustomerNo';
export const API_PATH_PROMO_CODE = '/api/sales/b2b/promo/:code\\?valid=1';
export const API_PATH_VALID_PROMO_CODES = '/api/sales/b2b/promo/?valid=1';

// product paths
export const API_PATH_KEYWORDS = '/api/keywords';
export const API_PATH_CATEGORY = '/api/products/category/:keyword';
export const API_PATH_PRODUCT = '/api/products/v2/keyword/:keyword';
export const API_PATH_ITEM_AVAILABILITY = '/node-sage/api/:Company/production/item/available/:ItemCode';
export const API_PATH_PRODUCT_MENU = '/api/menus/2';

export const API_PATH_SEARCH = '/api/search/v3/:term';
export const API_PATH_PAGE = '/api/pages/:keyword';
export const API_PATH_VERSION = '/version';


export const SUB_NAV_PROFILE = {
    url: PATH_PROFILE,
    title: 'Login Profile',
    id: 'SUB_NAV_PROFILE',
    priority: 0,
    menu: {
        items: []
    }
};

export const SUB_NAV_RECENT_ACCOUNTS = {
    title: 'Recent Accounts',
    id: 'SUB_NAV_RECENT_ACCOUNTS',
    priority: 10,
    menu: {items: []},
};

export const SUB_NAV_LOGOUT = {
    id: 'SUB_NAV_LOGOUT',
    title: 'Logout',
    url: PATH_LOGOUT,
    priority: 20,
    menu: {items: []},
};

export const SUB_NAV_CURRENT_ACCOUNT = {
    url: PATH_CUSTOMER_ACCOUNT,
    title: 'Replace with Selected Account name',
    id: 'SUB_NAV_CURRENT_ACCOUNT',
    menu: {
        items: [],
    }
};

export const SUB_NAV_LOGIN = {
    url: PATH_LOGIN,
    title: 'Login',
    id: 'SUB_NAV_LOGIN',
    menu: {
        items: []
    }
};

export const SUB_NAV_SIGNUP = {
    url: PATH_SIGNUP,
    title: 'Sign Up',
    id: 'SUB_NAV_SIGNUP',
    menu: {
        items: []
    }
};

export const CART_ACTIONS = {
    // cart actions
    newCart: 'new',
    duplicateCart: 'duplicate',
    updateCart: 'update',
    deleteCart: 'delete',
    promoteCart: 'promote',
    applyPromoCode: 'apply-discount',

    //cart item actions
    addItem: 'append',
    deleteItem: 'delete-line',
    updateCartItem: 'update-item',
    setComment: 'line-comment',
};


export const DOCUMENT_TITLES = {
    accountList: 'Account List: :name',
    home: 'Home',
    login: 'Log In',
    profile: 'Profile Page',
    signUp: 'Sign Up',
};
