import {
    BooleanLike,
    Customer,
    Editable,
    RecentCustomer,
    Salesperson,
    UserCustomerAccess,
    UserProfile,
    UserRole
} from "b2b-types";
import {EmptyObject} from "../../_types";

export interface UserState {
    token: string|null;
    tokenExpires: number;
    profile: EmptyObject | {
        googleId?: string;
        imageUrl?: string;
        email?: string;
        name?: string;
        givenName?: string;
        familyName?: string;
        chums?: {
            user?: UserProfile & {
                roles?:UserRole[];
                accounts?: UserCustomerAccess[]
            }
        }
    } & Editable;
    accounts: UserCustomerAccess[];
    roles: UserRole[];
    loggedIn: boolean;
    userAccount: UserCustomerAccess|EmptyObject|null;
    currentCustomer: Customer|EmptyObject|null;
    customerList: {
        list: Customer[];
        loading: boolean;
        loaded: boolean;
        filter: string;
        repFilter: string;
    };
    repList: {
        list: Salesperson[];
        loading: boolean;
        loaded: boolean;
    };
    signUp: {
        email: string;
        authKey: string; // not used?
        error: string|null;
        loading: boolean;
    };
    recentAccounts: RecentCustomer[];
    authType: string;
    passwordChange: {
        // @TODO: migrate to PasswordForm internal state
        oldPassword: string;
        newPassword: string;
        newPassword2: string;
        visible: boolean;
    };
    login: {
        // @TODO: migrate to Login Page internal state
        email: string;
        password: string;
        forgotPassword: boolean;
        loading: boolean;
    };
    loading: boolean;
    customerPermissions: {
        loading: boolean;
        loaded: boolean;
        permissions: {
            billTo: boolean;
            shipTo: string[];
        };
    };
}

export interface SetLoggedInProps {
    loggedIn: boolean;
    authType?: string;
    token?: string;
}

export interface UserProfileResponse {
    user?: UserProfile;
    roles?: UserRole[];
    accounts?: UserCustomerAccess[];
    reps?: Salesperson[];
}

