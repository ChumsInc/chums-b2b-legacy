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
import {EmptyObject, ExtendedUserProfile} from "../../_types";

export interface UserLoginState {
    // @TODO: migrate to Login Page internal state
    email: string;
    password: string;
    forgotPassword: boolean;
    loading: boolean;
}

export interface UserSignupState {
    email: string;
    authKey: string; // not used?
    authHash: string;
    error: string|null;
    loading: boolean;
}

export interface UserPasswordState {
    // @TODO: migrate to PasswordForm internal state
    oldPassword: string;
    newPassword: string;
    newPassword2: string;
    visible: boolean;
}

export interface UserState {
    token: string|null;
    tokenExpires: number;
    profile: EmptyObject | (ExtendedUserProfile & Editable);
    accounts: UserCustomerAccess[];
    roles: string[];
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
    signUp: UserSignupState;
    recentAccounts: RecentCustomer[];
    authType: string;
    passwordChange: UserPasswordState;
    login: UserLoginState;
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

