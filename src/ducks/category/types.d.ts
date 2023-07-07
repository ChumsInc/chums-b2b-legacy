import {ProductCategory, ProductCategoryChild} from "b2b-types";

export interface CategoryState {
    category: ProductCategory|null;
    loading: boolean;
}
