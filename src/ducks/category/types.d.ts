import {Keyword, ProductCategory} from "b2b-types";

export interface CategoryState {
    list: Keyword[];
    category: ProductCategory | null;
    content: ProductCategory | null;
    loading: boolean;
}
