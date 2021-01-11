export const ALERT_TYPES = {
    warning: 'alert-warning',
    danger: 'alert-danger',
    info: 'alert-info',
    success: 'alert-success',
    primary: 'alert-primary',
    secondary: 'alert-secondary',
    light: 'alert-light',
    dark: 'alert-dark',
    todo: 'alert-todo',
};


export const FETCH_INIT = 'FETCH_INIT';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';

// for app action/reducer
export const SET_ALERT = 'SET_ALERT';
export const DISMISS_ALERT = 'DISMISS_ALERT';
export const ALERT_CONTEXT_LOGIN = 'login';
export const SET_DOCUMENT_TITLE = 'SET_DOCUMENT_TITLE';
export const SET_LIFESTYLE = 'SET_LIFESTYLE';

export const FETCH_VERSION = 'FETCH_VERSION';

export const SET_SUBNAVBAR = 'SET_SUBNAVBAR';
export const SET_SEARCH = 'SET_SEARCH';
export const SELECT_SEARCH_RESULT = 'SELECT_SEARCH_RESULT';
export const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
export const SET_SEARCH_LOADING = 'SET_SEARCH_LOADING';
export const SHOW_SEARCH = 'SHOW_SEARCH';
export const FETCH_SEARCH_RESULTS = 'FETCH_SEARCH_RESULTS';
export const FETCH_PRODUCTS_MENU = 'FETCH_PRODUCTS_MENU';
export const SET_ROWS_PER_PAGE = 'SET_ROWS_PER_PAGE';
export const SET_CUSTOMER_TAB = 'SET_CUSTOMER_TAB';
export const TOGGLE_XS_NAVBAR = 'TOGGLE_XS_NAVBAR';

export const FETCH_SLIDES = 'FETCH_SLIDES';


// for user action/reducer
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const FETCH_LOCAL_LOGIN = 'FETCH_LOCAL_LOGIN';
export const FETCH_USER_PROFILE = 'FETCH_USER_PROFILE';

export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_USER_ACCOUNT = 'SET_USER_ACCOUNT';

export const FETCH_USER_CUSTOMERS = 'FETCH_USER_CUSTOMERS';

export const FETCH_REP_LIST = 'FETCH_REP_LIST';
export const FETCH_REP_LIST_FAILURE = 'FETCH_REP_LIST_FAILURE';
export const RECEIVE_REP_LIST = 'RECEIVE_REP_LIST';

export const UPDATE_LOGIN = 'UPDATE_LOGIN';
export const UPDATE_SIGNUP = 'UPDATE_SIGNUP';
export const POST_SIGNUP = 'POST_SIGNUP';
export const CHANGE_USER = 'CHANGE_USER';
export const CHANGE_USER_PASSWORD = 'CHANGE_USER_PASSWORD';
export const CLEAR_USER_PASSWORD = 'CLEAR_USER_PASSWORD';
export const FETCH_USER_SIGNUP = 'FETCH_USER_SIGNUP';



// for customer action/reducer
export const SET_CUSTOMER = 'SET_CUSTOMER';
export const FETCH_CUSTOMER = 'FETCH_CUSTOMER';
export const FETCH_CUSTOMER_FAILURE = 'FETCH_CUSTOMER_FAILURE';
export const RECEIVE_CUSTOMER = 'RECEIVE_CUSTOMER';
export const CHANGE_ACCOUNT_FIELD = 'CHANGE_ACCOUNT_FIELD';
export const CREATE_SHIPTO = 'CREATE_SHIPTO';
export const CHANGE_SHIPTO = 'CHANGE_SHIPTO';
export const SAVE_CUSTOMER = 'SAVE_CUSTOMER';
export const SAVE_SHIP_TO = 'SAVE_SHIP_TO';

export const SELECT_ACCOUNT_USER = 'SELECT_ACCOUNT_USER';
export const CHANGE_ACCOUNT_USER = 'CHANGE_ACCOUNT_USER';
export const CREATE_ACCOUNT_USER = 'CREATE_ACCOUNT_USER';
export const CANCEL_CREATE_ACCOUNT_USER = 'CANCEL_CREATE_ACCOUNT_USER';
export const FETCH_ACCOUNT_USERS = 'FETCH_ACCOUNT_USERS';

export const FETCH_ORDERS = 'FETCH_ORDERS';
export const FETCH_ORDERS_FAILURE = 'FETCH_ORDERS_FAILURE';
export const RECEIVE_ORDERS = 'RECEIVE_ORDERS';

export const SELECT_INVOICE = 'SELECT_INVOICE';
export const FETCH_INVOICES = 'FETCH_INVOICES';
export const FETCH_INVOICE = 'FETCH_INVOICE';
export const RECEIVE_PAST_ORDERS = 'RECEIVE_PAST_ORDERS';

export const SET_CART = 'SET_CART';
export const UPDATE_CART = 'UPDATE_CART';
export const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
export const FETCH_CART = 'FETCH_CART';
export const FETCH_CART_FAILURE = 'FETCH_CART_FAILURE';
export const RECEIVE_CART = 'RECEIVE_CART';
export const CREATE_NEW_CART = 'CREATE_NEW_CART';

export const SET_CART_ITEM_QUANTITY = 'SET_CART_ITEM_QUANTITY';

export const SELECT_SO = 'SELECT_SO';
export const FETCH_SALES_ORDER = 'FETCH_SALES_ORDER';


// for the cart action/reducer
export const APPEND_ORDER_COMMENT = 'APPEND_ORDER_COMMENT';
export const SAVE_CART = 'SAVE_CART';
export const SAVE_CART_FAILURE = 'SAVE_CART_FAILURE';
export const SAVE_CART_SUCCESS = 'SAVE_CART_SUCCESS';

export const DELETE_CART = 'DELETE_CART';

export const PROMOTE_CART_FAILURE = 'PROMOTE_CART_FAILURE';
export const PROMOTE_CART = 'PROMOTE_CART';
export const PROMOTE_CART_SUCCESS = 'PROMOTE_CART_SUCCESS';

export const FETCH_ITEM_AVAILABILITY = 'FETCH_ITEM_AVAILABILITY';
export const FETCH_ITEM_AVAILABILITY_FAILURE = 'FETCH_ITEM_AVAILABILITY_FAILURE';
export const RECEIVE_ITEM_AVAILABILITY = 'RECEIVE_ITEM_AVAILABILITY';

export const SEND_ORDER_EMAIL = 'SEND_ORDER_EMAIL';
export const SEND_ORDER_EMAIL_ACK = 'SEND_ORDER_EMAIL_ACK';

export const SET_CART_PROGRESS = 'SET_CART_PROGRESS';
export const SET_SHIP_DATE = 'SET_SHIP_DATE';
export const SET_SHIPPING_ACCOUNT = 'SET_SHIPPING_ACCOUNT';
export const FETCH_PROMO_CODE = 'FETCH_PROMO_CODE';
export const SET_PROMO_CODE = 'SET_PROMO_CODE';
export const FETCH_APPLY_PROMO_CODE = 'FETCH_APPLY_PROMO_CODE';
export const FETCH_VALID_PROMO_CODES = 'FETCH_VALID_PROMO_CODES';

// for product action/reducer
export const FETCH_KEYWORDS = 'FETCH_KEYWORDS';

export const FETCH_PRODUCTS = 'FETCH_PRODUCTS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';

export const FETCH_PRODUCT = 'FETCH_PRODUCT';
export const CLEAR_PRODUCT = 'CLEAR_PRODUCT';

export const FETCH_CATEGORY = 'FETCH_CATEGORY';

export const FETCH_PRODUCT_URL = 'FETCH_PRODUCT_URL';
export const FETCH_PRODUCT_URL_FAILURE = 'FETCH_PRODUCT_URL_FAILURE';

export const FETCH_PAGE = 'FETCH_PAGE';

export const SELECT_VARIANT = 'SELECT_VARIANT';
export const SELECT_COLOR = 'SELECT_COLOR';
export const SELECT_ITEM = 'SELECT_ITEM';

export const SELL_AS_SELF = 1;
export const SELL_AS_MIX = 3;
export const SELL_AS_COLOR = 4;

export const PRICE_FIELDS = {
    standard: 'stdPrice',
    msrp: 'msrp'
};

export const UPDATE_GA = 'UPDATE_GA';

