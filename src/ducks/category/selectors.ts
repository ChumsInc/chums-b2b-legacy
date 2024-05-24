import {RootState} from "../../app/configureStore";

export const selectCategoryLoading = (state:RootState) => state.category.loading ?? false;
export const selectCategory = (state:RootState) => state.category.category;
