import './global-window';
import {initialProductsState} from "../ducks/products";
import {initialCustomerState} from "../ducks/customer";
import {initialCartState} from "../ducks/cart";
import {initialMessagesState} from "../ducks/messages";
import {initialUserState} from '../ducks/user';
import {initialAppState} from '../ducks/app';
import {initialSlidesState} from '../ducks/slides'
import {initialMenuState} from "../ducks/menu";
import {initialKeywordsState} from "../ducks/keywords";
import {initialCategoryState} from "../ducks/category";
import {initialCartsState} from "../ducks/carts";
import {initialInvoicesState} from "../ducks/invoices";
import {initialOpenOrderState} from "../ducks/open-orders";
import {initialPageState} from "../ducks/page";
import {initialPromoCodeState} from "../ducks/promo-code";
import {initialSalesOrderState} from "../ducks/salesOrder";
import {initialSearchState} from "../ducks/search";
import {initialVersionState} from "../ducks/version";
import {PreloadedState} from "../_types";

export default function prepState(preload: PreloadedState = window.__PRELOADED_STATE__ ?? {}) {
    return {
        app: initialAppState(preload),
        cart: initialCartState(),
        carts: initialCartsState(),
        category: initialCategoryState(preload),
        customer: initialCustomerState(),
        invoices: initialInvoicesState(),
        keywords: initialKeywordsState(preload),
        menu: initialMenuState(preload),
        messages: initialMessagesState(preload),
        openOrders: initialOpenOrderState(),
        page: initialPageState(preload),
        products: initialProductsState(preload),
        promo_code: initialPromoCodeState(preload),
        salesOrder: initialSalesOrderState(),
        search: initialSearchState(),
        slides: initialSlidesState(preload),
        user: initialUserState(),
        version: initialVersionState(preload),
    }
};

