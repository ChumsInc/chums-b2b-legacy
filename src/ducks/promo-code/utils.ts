import {PromoCode} from "b2b-types";

export const promoCodeSorter = (a:PromoCode, b:PromoCode) => a.id - b.id;
