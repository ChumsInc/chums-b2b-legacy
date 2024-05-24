import {PromoCode} from "b2b-types";

export interface PromoCodeState {
    code: string;
    description: string;
    requiredItems: string[];
    validCodes: PromoCode[];
    loading: boolean;
}
