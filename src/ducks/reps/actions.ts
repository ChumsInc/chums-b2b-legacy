import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchRepList} from "../../api/user";
import {RootState} from "../../app/configureStore";
import {selectIsEmployee, selectIsRep, selectLoggedIn} from "../user/selectors";
import {selectRepsLoading} from "./selectors";

export const loadRepList = createAsyncThunk(
    'reps/load',
    async () => {
        return await fetchRepList();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state)
                && (selectIsEmployee(state) || selectIsRep(state))
                && !selectRepsLoading(state);
        }
    }
)
