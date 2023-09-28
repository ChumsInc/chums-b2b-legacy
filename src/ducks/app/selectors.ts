import {RootState} from "../../app/configureStore";

export const selectProductMenu = (state:RootState) => state.app.productMenu;
export const selectShowNavBar = (state:RootState) => state.app.showNavBar;
export const selectSubNav = (state:RootState) => state.app.subNav;
export const selectRowsPerPage = (state:RootState) => state.app.rowsPerPage;
export const selectCustomerTab = (state:RootState) => state.app.customerTab;
export const selectLifestyle = (state:RootState) => state.app.lifestyle;
