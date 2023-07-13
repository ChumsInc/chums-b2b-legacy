import {initialProductsState} from "../ducks/products";
import {initialCustomerState} from "../ducks/customer";
import {initialCartState} from "../ducks/cart";
import {initialMessagesState} from "../ducks/messages";
import {initialUserState} from '../ducks/user';
import {initialAppState} from '../ducks/app';
import {initialSlidesState} from '../ducks/slides'
import {initialMenuState} from "../ducks/menu";
import {initialKeywordsState} from "../ducks/keywords";

const preloadedState = window.__PRELOADED_STATE__ ?? {};
preloadedState.app = {...initialAppState};
preloadedState.slides = {...initialSlidesState};

preloadedState.cart = {...initialCartState}
preloadedState.keywords = {...initialKeywordsState};
preloadedState.menu = {...initialMenuState};

preloadedState.messages = {...initialMessagesState}
preloadedState.user = {...initialUserState};

preloadedState.customer = {...initialCustomerState}
preloadedState.products = {...initialProductsState}

export default preloadedState;
