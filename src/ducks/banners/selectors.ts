import {RootState} from "../../app/configureStore";

export const selectBannersList = (state:RootState) => state.banners.list;
export const selectBannersLoaded = (state: RootState) => state.banners.loaded;
export const selectBannersLoading = (state: RootState) => state.banners.loading;
export const selectBannersUpdated = (state:RootState) => state.banners.updated;
