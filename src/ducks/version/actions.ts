import {LoadVersionResponse, selectShouldCheckVersion, selectVersionLoading} from "./index";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchVersion} from "../../api/version";
import {RootState} from "../../app/configureStore";



export const loadVersion = createAsyncThunk<LoadVersionResponse, boolean | undefined>(
    'version/load',
    async () => {
        const versionNo = await fetchVersion();
        const lastChecked = new Date().valueOf();
        return {versionNo, lastChecked};
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return arg === true || (!selectVersionLoading(state) && selectShouldCheckVersion(state));
        }
    }
)

export const ignoreVersion = createAction('version/ignore')
