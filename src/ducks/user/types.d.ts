import {
    BasicCustomer,
    Customer,
    Editable,
    RecentCustomer,
    Salesperson,
    UserCustomerAccess,
    UserProfile,
    UserRole
} from "b2b-types";
import {EmptyObject} from "../../types/generic";
import {ExtendedUserProfile} from "../../types/user";
import {DeprecatedAsyncAction} from "../../types/actions";

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
    error: string | null;
    loading: boolean;
}

export interface UserPasswordState {
    // @TODO: migrate to PasswordForm internal state
    oldPassword: string;
    newPassword: string;
    newPassword2: string;
    visible: boolean;
}



export interface SetLoggedInProps {
    loggedIn: boolean;
    authType?: string;
    token?: string;
}

export interface UserProfileResponse {
    user?: UserProfile;
    roles?: string[];
    accounts?: UserCustomerAccess[];
    reps?: Salesperson[];
    picture?: string | null;
    expires?: number;
    token?: string;
}

export interface FunkyUserProfileResponse extends UserProfileResponse {
    roles?: (string | UserRole)[];
}


export interface DeprecatedUserAction extends DeprecatedAsyncAction {
    loggedIn?: boolean;
    token?: string;
}

export interface DeprecatedUserProfileAction extends DeprecatedUserAction {
    loggedIn?: boolean;
    token?: string;
    props: ExtendedUserProfile;
}

export interface ChangePasswordProps {
    oldPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    error?: string;
    success?: boolean;
    token?: string;
}

export interface SetNewPasswordProps {
    key: string;
    hash: string;
    newPassword: string;
}

export type SignUpProfile = Pick<UserProfile, 'id'|'email'|'name'|'accountType'>;
