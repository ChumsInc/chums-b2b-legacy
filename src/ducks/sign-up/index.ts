import {createReducer} from "@reduxjs/toolkit";
import {setLoggedIn} from "../user/actions";
import {SignUpProfile} from "./types";
import {loadSignUpProfile, signUpUser} from "./actions";
import {isErrorResponse} from "../../utils/typeguards";

export interface SignUpState {
    email: string;
    profile: SignUpProfile | null;
    error: string | null;
    status: 'idle' | 'loading' | 'saving' | 'rejected' | 'success';
}

const initialState = (): SignUpState => ({
    email: '',
    profile: null,
    error: null,
    status: 'idle',
});

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
            state.profile = null;
        })
        .addCase(loadSignUpProfile.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(loadSignUpProfile.fulfilled, (state, action) => {
            if (!isErrorResponse(action.payload)) {
                state.profile = action.payload;
            }
            state.status = 'idle';
        })
        .addCase(loadSignUpProfile.rejected, (state, action) => {
            state.profile = null;
            state.status = 'idle';
        })
});

export default signUpReducer;
