import {createAsyncThunk} from "@reduxjs/toolkit";
import {SignUpUser} from "../../types/user";
import {fetchSignUpProfile, postSignUpUser} from "../../api/user";
import {RootState} from "../../app/configureStore";
import isEmail from "validator/lib/isEmail";
import {selectSignUpStatus} from "./selectors";
import {LoadProfileProps, SignUpProfile} from "./types";
import {APIErrorResponse} from "../../types/generic";

export const signUpUser = createAsyncThunk<unknown, SignUpUser>(
    'sign-up/saveUser',
    async (arg) => {
        return await postSignUpUser(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return isEmail(arg.email) && arg.agreeToPolicy && selectSignUpStatus(state) === 'idle';
        }
    }
)

export const loadSignUpProfile = createAsyncThunk<SignUpProfile | APIErrorResponse | null, LoadProfileProps>(
    'sign-up/loadProfile',
    async (arg) => {
        return await fetchSignUpProfile(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectSignUpStatus(state) === 'idle';
        }
    }
)
