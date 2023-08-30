export interface TermsCode {
    description: string;
    due: number;
}

export interface TermsCodeList {
    [key:string]: TermsCode;
}

export interface PaymentType {
    code: string;
    sageCode: string;
    description: string;
    message: string;
    allowTerms: boolean;
    allowCC: boolean;
    disabled: boolean;
    requirePO: boolean;
    prepaid: boolean;
    customerValue?: string|null;
}

export interface PaymentTypeList {
    [key:string]: PaymentType;
}


export interface ShippingMethod {
    code: string;
    description: string;
    allowCustomerAccount:boolean;
    carrier: string;
}

export interface ShippingMethodList {
    [key:string]: ShippingMethod;
}

export interface PriceLevelsDescriptionList {
    [key:string]: string;
}

export interface CustomerPermissions {
    billTo: boolean;
    shipTo: string[];
}

export interface CustomerShippingAccount {
    enabled: boolean;
    value: string;
}
