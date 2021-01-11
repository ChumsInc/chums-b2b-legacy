import {combineReducers} from 'redux';
import {
    CANCEL_CREATE_ACCOUNT_USER,
    CHANGE_ACCOUNT_FIELD,
    CHANGE_ACCOUNT_USER,
    CHANGE_SHIPTO,
    CREATE_ACCOUNT_USER,
    CREATE_SHIPTO,
    FETCH_ACCOUNT_USERS,
    FETCH_CUSTOMER,
    FETCH_CUSTOMER_FAILURE,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_SUCCESS,
    SAVE_CUSTOMER,
    SELECT_ACCOUNT_USER,
    SET_CUSTOMER,
    SET_LOGGED_IN,
    SET_USER_ACCOUNT
} from "../constants/actions";
import {DEFAULT_COMPANY} from "../constants/defaults";
import {companyCode} from "../utils/customer";
import localStore from "../utils/LocalStore";
import {STORE_CURRENT_CART, STORE_CUSTOMER} from "../constants/stores";
import {auth} from "../utils/IntranetAuthService";


const isLoggedIn = auth.loggedIn();

const defaults = {
    currentCart: '',
    customer: {}
};


if (isLoggedIn) {
    defaults.currentCart = localStore.getItem(STORE_CURRENT_CART) || '';
    defaults.customer = localStore.getItem(STORE_CUSTOMER) || defaults.customer;
}


const company = (state = DEFAULT_COMPANY, action) => {
    const {type, status, userAccount, customer} = action;
    switch (type) {
    case SET_USER_ACCOUNT:
        return companyCode(userAccount.Company);
    case FETCH_CUSTOMER:
        if (status === FETCH_INIT) {
            return companyCode(customer.Company);
        }
        return state;
    case SET_CUSTOMER:
        return companyCode(customer.Company);
    default:
        return state;
    }
};

const account = (state = defaults.customer, action) => {
    const {type, status, customer = {}, props, loggedIn} = action;
    switch (type) {
    case SET_CUSTOMER:
        return {...customer};
    case FETCH_CUSTOMER:
        if (status === FETCH_INIT) {
            return {...state, ...customer};
        }
        if (status === FETCH_SUCCESS) {
            return {...customer};
        }
        return state;
    case SET_LOGGED_IN:
        return loggedIn === false ? {} : state;
    case SET_USER_ACCOUNT:
        return {};
    case FETCH_CUSTOMER_FAILURE:
        return {};
    case CHANGE_ACCOUNT_FIELD:
        return {...state, ...props, changed: true};
    default:
        return state;
    }
};

const contacts = (state = [], action) => {
    const {type, status, contacts = [], loggedIn} = action;
    switch (type) {
    case FETCH_CUSTOMER:
        if (status === FETCH_SUCCESS) {
            return [...contacts];
        }
        if (status === FETCH_FAILURE) {
            return [];
        }
        return state;
    case SET_LOGGED_IN:
        return loggedIn === false ? [] : state;
    default:
        return state;
    }
};

const pricing = (state = [], action) => {
    const {type, status, pricing = [], loggedIn} = action;
    switch (type) {
    case FETCH_CUSTOMER:
        if (status === FETCH_SUCCESS) {
            return [...pricing];
        }
        if (status === FETCH_FAILURE) {
            return [];
        }
        return state;
    case SET_LOGGED_IN:
        return loggedIn === false ? [] : state;
    default:
        return state;
    }
};

const shipToAddresses = (state = [], action) => {
    const {type, status, shipTo = [], shipToCode, props, loggedIn} = action;
    switch (type) {
    case CHANGE_SHIPTO:
        return [
            ...state.filter(st => st.ShipToCode !== shipToCode),
            ...state.filter(st => st.ShipToCode === shipToCode).map(st => ({...st, ...props, changed: true})),
        ];
    case CREATE_SHIPTO:
        return [
            ...state,
            {...props, changed: true}
        ];
    case FETCH_CUSTOMER:
        if (status === FETCH_SUCCESS) {
            return [...shipTo];
        }
        if (status === FETCH_FAILURE) {
            return [];
        }
        return state;
    case SET_LOGGED_IN:
        return loggedIn === false ? [] : state;
    default:
        return state;
    }
};

const paymentCards = (state = [], action) => {
    const {type, status, paymentCards, loggedIn} = action;
    switch (type) {
    case SET_CUSTOMER:
        return [];
    case FETCH_CUSTOMER:
        if (status === FETCH_SUCCESS) {
            return [...paymentCards];
        }
        return state;
    case SET_LOGGED_IN:
        return loggedIn === false ? [] : state;
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case SAVE_CUSTOMER:
    case FETCH_CUSTOMER:
    case FETCH_ACCOUNT_USERS:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

const users = (state = [], action) => {
    const {type, status, users, id, props, loggedIn} = action;
    switch (type) {
    case FETCH_CUSTOMER:
        if (status === FETCH_INIT) {
            return [];
        }
        if (status === FETCH_SUCCESS) {
            return [...users];
        }
        return state;
    case FETCH_ACCOUNT_USERS:
        return status === FETCH_SUCCESS ? [...users] : state;
    case CREATE_ACCOUNT_USER:
        return [
            ...state.filter(u => u.id !== 0).map(({selected, ...user}) => user),
            {id: 0, name: '', email: '', selected: true}
        ];
    case CANCEL_CREATE_ACCOUNT_USER:
        return [
            ...state.filter(u => u.id !== 0).map(({selected, ...user}) => user),
        ];
    case CHANGE_ACCOUNT_USER:
        return [
            ...state.filter(u => u.id !== id),
            ...state.filter(u => u.id === id).map(u => ({...u, ...props, changed: true})),
        ];
    case SELECT_ACCOUNT_USER:
        return [
            ...state.filter(u => u.id !== id).map(({selected, ...user}) => user),
            ...state.filter(u => u.id === id).map(user => ({...user, selected: true}))
        ];
    case SET_LOGGED_IN:
        return loggedIn === false ? [] : state;
    default:
        return state;
    }
};


export default combineReducers({
    company,
    account,
    contacts,
    pricing,
    shipToAddresses,
    paymentCards,
    loading,
    users,
});
