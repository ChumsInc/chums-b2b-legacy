export const STORE_CURRENT_CART = 'chums/b2b/current-cart';
export const STORE_AUTHTYPE = 'chums/b2b/authtype';
export const STORE_PROFILE = 'chums/b2b/profile';
export const STORE_TOKEN = 'chums/b2b/id_token';
export const STORE_USER = 'chums/b2b/googleUser';
export const STORE_CUSTOMER = 'chums/b2b/customer';
export const STORE_USER_ACCESS = 'chums/b2b/userAccess';
export const STORE_USER_PREFS = 'chums/b2b/prefs';
export const STORE_RECENT_ACCOUNTS = 'chums/b2b/recentAccounts';
export const STORE_INVOICES_ROWS_PER_PAGE = 'chums/b2b/invoices.rowsPerPage';
export const STORE_INVOICES_SORT = 'chums/b2b/invoices.sort';

export const STORE_CUSTOMER_SHIPPING_ACCOUNT = 'com.chums.b2b.customerShippingAccount';

export interface DeprecatedStorageKeyList {
    [key: string]: string | null;
}

export const deprecatedStorageKeys: DeprecatedStorageKeyList = {
    'com.chums.b2b.profile': STORE_PROFILE,
    'com.chums.b2b.userAccount': STORE_USER_ACCESS,
    'com.chums.b2b.id_token': STORE_TOKEN,
    'chums::b2b::current-cart': STORE_CURRENT_CART,
    'com.chums.b2b.current_cart': STORE_CURRENT_CART,
    'com.chums.b2b.authtype': STORE_AUTHTYPE,
    'com.chums.b2b.googleUser': STORE_USER,
    'com.chums.b2b.customer': STORE_CUSTOMER,
    'com.chums.b2b.prefs': STORE_USER_PREFS,
    'chums-b2b::accountList::rowsPerPage': null,
    'com.chums.b2b.recentAccounts': STORE_RECENT_ACCOUNTS,
    'invoices.rowsPerPage': STORE_INVOICES_ROWS_PER_PAGE,
    'invoices.sort': STORE_INVOICES_SORT,
}
