import {Customer, Salesperson, UserCustomerAccess, UserProfile} from "b2b-types";
import {EmptyObject} from "../../_types";
import {CustomerKey} from "b2b-types/src/customer";

export const salespersonKey = (sp: Salesperson) => `${sp.SalespersonDivisionNo}-${sp.SalespersonNo}`;

export const userAccountSort = (a:UserCustomerAccess, b:UserCustomerAccess):number => {
    return a.id - b.id;
}

export const getPrimaryAccount = (accountList:UserCustomerAccess[]):UserCustomerAccess|null => {
    if (!accountList.length) {
        return null;
    }
    const [primary] = accountList.filter(acct => acct.primaryAccount);
    return primary ?? accountList[0];
}

export const userRepListSort = (a:Salesperson, b:Salesperson) => {
    return salespersonKey(a).toUpperCase() > salespersonKey(b).toUpperCase() ? 1 : -1;
}

export const isCustomerAccess = (value:UserCustomerAccess|EmptyObject|null):value is UserCustomerAccess  => {
    return !!value && (value as UserCustomerAccess).id !== undefined;
}

export const isUserProfile = (user:UserProfile|null): user is UserProfile => {
    return (user as UserProfile).id !== undefined;
}

export const isCustomer = (customer:CustomerKey|EmptyObject|null): customer is CustomerKey => {
    return !!customer && (customer as CustomerKey).CustomerNo !== undefined;
}
