import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {SignUpUser} from "../../types/user";
import {RootState} from "../../app/configureStore";
import isEmail from 'validator/lib/isEmail';
import {postSignUpUser} from "../../api/user";
import {setLoggedIn} from "../user/actions";

export interface SignUpState {
    email: string;
    authKey: string;
    authHash: string;
    error: string|null;
    status: 'idle'|'loading'|'saving'|'rejected'|'success';
}

const initialState = ():SignUpState => ({
    email: '',
    authKey: '',
    authHash: '',
    error: null,
    status: 'idle',
});

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

export const selectSignUpStatus = (state:RootState) => state.signUp.status;
export const selectSignUpError = (state:RootState) => state.signUp.error;

const signUpReducer = createReducer(initialState(), builder => {
    builder
        .addCase(signUpUser.pending, (state) => {
            state.status = 'saving';
        })
        .addCase(signUpUser.fulfilled, (state, action) => {
            state.status = 'success';

        })
        .addCase(signUpUser.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.error.message ?? null;
        })
        .addCase(setLoggedIn, (state) => {
            state.email = '';
            state.authKey = '';
            state.authHash = '';
        })
});

export default signUpReducer;
