import {RootState} from "@/app/configureStore";

export const selectRepsList = (state:RootState) => state.reps.list;
export const selectRepsLoading = (state:RootState) => state.reps.loading;
export const selectRepsLoaded = (state:RootState) => state.reps.loaded;
