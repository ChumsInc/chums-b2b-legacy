import {
    Banner,
    ContentPage,
    Keyword,
    Menu,
    Message,
    Product,
    ProductCategory,
    PromoCode,
    Slide,
    UserCustomerAccess,
    UserProfile
} from "b2b-types";

export interface PreloadedState {
    app?: {
        keywords?: Keyword[];
        messages?: Message[];
        productMenu?: Menu;
        slides?: Slide[],
    }
    banners?: {
        list: Banner[]
    }
    category?: {
        keywords?: Keyword[];
        content?: ProductCategory | null;
    }
    keywords?: {
        list?: Keyword[];
        loading?: boolean;
    }
    menu?: {
        loaded: boolean;
        productMenu?: Menu;
        resourcesMenu?: Menu;
    }
    messages?: {
        list?: Message[];
    }
    page?: {
        list?: Keyword[];
        content?: ContentPage | null;
    }
    products?: {
        keywords?: Keyword[];
        product?: Product | null;
    },
    promoCodes?: {
        current?: PromoCode | null;
        list?: PromoCode[];
    }
    slides?: {
        list?: Slide[];
        loaded?: boolean;
    }
    version?: {
        versionNo?: string|null;
    }
}

export interface ExtendedUserProfile extends UserProfile {
    accounts?: UserCustomerAccess[];
    roles?: string[]
}

export interface GoogleProfile {
    email?: string;
    familyName?: string;
    givenName?: string;
    googleId?: string;
    imageUrl?: string;
    name?: string;
}

export interface StoredProfile extends GoogleProfile {
    chums?: {
        user?: ExtendedUserProfile
    },

}
