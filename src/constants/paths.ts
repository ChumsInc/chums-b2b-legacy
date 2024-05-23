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

export interface DocumentTitleList {
    [key: string]: string;
}
export const documentTitles:DocumentTitleList = {
    accountList: 'Account List: :name',
    home: 'Home',
    login: 'Log In',
    profile: 'Profile Page',
    profileChangePassword: 'Change Password',
    signUp: 'Sign Up',
};
