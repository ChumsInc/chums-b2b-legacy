declare const rootReducer: import("redux").Reducer<import("redux").CombinedState<{
    app: import("redux").CombinedState<{
        alerts: any[];
        productMenu: any;
        productMenuBC: any;
        showNavBar: boolean;
        subNav: any;
        rowsPerPage: any;
        customerTab: any;
        slides: any;
        messages: any;
        documentTitle: any;
        keywords: any;
        lifestyle: any;
        version: any;
        debug: null;
        search: import("redux").CombinedState<{
            term: any;
            results: any[];
            loading: boolean;
            show: any;
        }>;
    }>;
    user: import("redux").CombinedState<{
        token: any;
        profile: any;
        accounts: any[];
        roles: any[];
        loggedIn: boolean;
        userAccount: any;
        currentCustomer: any;
        customerList: never;
        repList: never;
        signUp: any;
        recentAccounts: any[];
        authType: any;
        passwordChange: any;
        login: any;
        loading: boolean;
    }>;
    products: import("redux").CombinedState<{
        keywords: any;
        loadingKeywords: boolean;
        product: any;
        loading: boolean;
        selectedProduct: any;
        variantId: any;
        colorCode: any;
        msrp: any[];
        customerPrice: any[];
        salesUM: any;
        cartItem: any;
    }>;
    category: import("redux").CombinedState<{
        id: any;
        title: any;
        pageText: any;
        lifestyle: any;
        children: any[];
        loading: boolean;
    }>;
    customer: import("redux").CombinedState<{
        company: string;
        account: any;
        contacts: any[];
        pricing: any[];
        shipToAddresses: any[];
        paymentCards: any[];
        loading: boolean;
        users: any[];
    }>;
    cart: import("redux").CombinedState<{
        cartNo: any;
        cartName: any;
        cartTotal: any;
        cartQuantity: any;
        loading: any;
        loaded: any;
        itemAvailability: any;
        cartProgress: any;
        shipDate: any;
        shippingAccount: any;
        cartMessage: any;
    }>;
    carts: import("redux").CombinedState<{
        list: any[];
        loading: boolean;
    }>;
    openOrders: import("redux").CombinedState<{
        list: any[];
        loading: boolean;
    }>;
    pastOrders: import("redux").CombinedState<{
        list: any[];
        loading: boolean;
    }>;
    salesOrder: import("redux").CombinedState<{
        salesOrderNo: any;
        processing: boolean;
        header: any;
        detail: any[];
        readOnly: never;
        orderType: string;
        sendEmailStatus: any;
        attempts: number;
    }>;
    page: import("redux").CombinedState<{
        list: any;
        loading: boolean;
        content: any;
    }>;
    promo_code: import("redux").CombinedState<{
        code: any;
        description: any;
        requiredItems: any;
        validCodes: any[];
        loading: boolean;
    }>;
    invoices: import("redux").CombinedState<{
        list: any[];
        invoice: any;
        loading: boolean;
    }>;
    version: import("./version").VersionState;
}>, any>;
export declare type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
