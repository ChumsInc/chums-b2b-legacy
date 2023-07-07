import {selectShouldCheckVersion, selectVersionLoading} from "./index";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {createAction} from "@reduxjs/toolkit";
import {fetchVersion} from "../../api/version";


export const loadVersion = createAsyncThunk(
    'version/load',
    /**
     *
     * @return {Promise<{versionNo: string, lastChecked: number}>}
     */
    async (arg) => {
        const versionNo =  await fetchVersion();
        const lastChecked = new Date().valueOf();
        return {versionNo, lastChecked};
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return arg === true || !selectVersionLoading(state) && selectShouldCheckVersion(state);
        }
    }
)

export const ignoreVersion = createAction('version/ignore')
