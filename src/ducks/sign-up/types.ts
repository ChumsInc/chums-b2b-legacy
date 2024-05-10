import {UserProfile} from "b2b-types";

export type SignUpProfile = Pick<UserProfile, 'id'|'email'|'name'|'accountType'>;

export interface LoadProfileProps {
    key: string;
    hash: string;
}
