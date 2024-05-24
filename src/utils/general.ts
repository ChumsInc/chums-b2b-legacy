import {LoadStatus} from "../types/generic";
import {ShippingMethodList} from "../types/customer";

export const noop = () => {};

export function waitForIt(delay: number) {
    return new Promise(res => setTimeout(res, delay));
}

export const ShippingMethods:ShippingMethodList = {
    '1FEX_GROUND': {code: '1FEX_GROUND', description: 'FedEX Ground', allowCustomerAccount: true, carrier: 'fedex', enabled: true},
    '1UPS_GROUND': {code: '1UPS_GROUND', description: 'UPS Ground', allowCustomerAccount: true, carrier: 'ups', enabled: true},
    'APP': {code: 'APP', description: 'USPS Priority', allowCustomerAccount: false, carrier: 'usps', enabled: true},

    '1FEX_1ST_ONIGHT': {code: '1FEX_1ST_ONIGHT', description: 'FedEx 1st Overnight', allowCustomerAccount: true, carrier: 'fedex'},
    '1FEX_DEFAIR': {code: '1FEX_DEFAIR', description: 'FedEx Defered Air', allowCustomerAccount: true, carrier: 'fedex'},
    '1FEX_ECN_2DAY': {code: '1FEX_ECN_2DAY', description: 'FedEx Economy 2 Day', allowCustomerAccount: true, carrier: 'fedex'},
    '1FEX_EXP_SAVER': {code: '1FEX_EXP_SAVER', description: 'FedEx Express Saver', allowCustomerAccount: true, carrier: 'fedex'},
    '1FEX_PRI_ONIGHT': {code: '1FEX_PRI_ONIGHT', description: 'FedEx Priority Ovn', allowCustomerAccount: true, carrier: 'fedex'},
    '1FEX_STD_ONIGHT': {code: '1FEX_STD_ONIGHT', description: 'FedEx Std Overnight', allowCustomerAccount: true, carrier: 'fedex'},

    '1UPS_2DAY': {code: '1UPS_2DAY', description: 'UPS 2nd Day Air', allowCustomerAccount: true, carrier: 'ups'},
    '1UPS_2DAY_AM': {code: '1UPS_2DAY_AM', description: 'UPS 2nd Day Air AM', allowCustomerAccount: true, carrier: 'ups'},
    '1UPS_3DAY': {code: '1UPS_3DAY', description: 'UPS 3 Day Select', allowCustomerAccount: true, carrier: 'ups'},
    '1UPS_NEXT_DAY': {code: '1UPS_NEXT_DAY', description: 'UPS Next Day Air', allowCustomerAccount: true, carrier: 'ups'},
    '1UPS_NEXT_DAY_S': {code: '1UPS_NEXT_DAY_S', description: 'UPS Next Day SAVER', allowCustomerAccount: true, carrier: 'ups'},

    'TO BE DECIDED': {code: 'TO BE DECIDED', description: 'To Be Decided', allowCustomerAccount: false, carrier: '', enabled: true},

}
