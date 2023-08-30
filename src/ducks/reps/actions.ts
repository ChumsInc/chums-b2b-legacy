import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchRepList} from "@/api/user";
import {RootState} from "@/app/configureStore";
import {selectIsEmployee, selectIsRep, selectLoggedIn} from "@/ducks/user/selectors";
import {selectRepsLoading} from "@/ducks/reps/selectors";

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
