import {RootState} from "../../app/configureStore";

export const selectSignUpStatus = (state:RootState) => state.signUp.status;
export const selectSignUpError = (state:RootState) => state.signUp.error;
export const selectSignUpProfile = (state:RootState) => state.signUp.profile;
