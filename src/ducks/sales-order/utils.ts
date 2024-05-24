import {CartItem, CustomerAddress, SalesOrderDetailLine, SalesOrderHeader} from "b2b-types";
import {SortProps} from "../../types/generic";
import dayjs from "dayjs";
import {EditableSalesOrder} from "../open-orders/types";
import {DeprecatedUpdateCartItemAction} from "../../types/actions";
import {UnknownAction} from "@reduxjs/toolkit";

export const defaultDetailSorter = (a: SalesOrderDetailLine, b: SalesOrderDetailLine) => {
    return +a.LineKey - +b.LineKey;
}

export const defaultSalesOrderSort: SortProps<SalesOrderHeader> = {field: 'SalesOrderNo', ascending: true};

export const salesOrderSorter = (sort: SortProps<SalesOrderHeader>) =>
    (a: SalesOrderHeader, b: SalesOrderHeader) => {
        const sortMod = sort.ascending ? 1 : -1;
        switch (sort.field) {
            case 'CustomerPONo':
            case 'ShipToName':
            case "ShipToCity":
                return (
                    (a[sort.field] ?? '').toLowerCase() === (b[sort.field] ?? '').toLowerCase()
                        ? (a.SalesOrderNo > b.SalesOrderNo ? 1 : -1)
                        : ((a[sort.field] ?? '').toLowerCase() > (b[sort.field] ?? '').toLowerCase() ? 1 : -1)
                ) * sortMod;
            case 'TaxableAmt':
                return (
                    +(a[sort.field] ?? 0) === +(b[sort.field] ?? 0)
                        ? (a.SalesOrderNo > b.SalesOrderNo ? 1 : -1)
                        : (+(a[sort.field] ?? 0) > +(b[sort.field] ?? 0) ? 1 : -1)
                ) * sortMod;
            case 'OrderDate':
            case 'ShipExpireDate':
                return (
                    dayjs(a[sort.field] ?? null).valueOf() === dayjs(b[sort.field] ?? null).valueOf()
                        ? (a.SalesOrderNo > b.SalesOrderNo ? 1 : -1)
                        : (dayjs(a[sort.field] ?? null).valueOf() > dayjs(b[sort.field] ?? 0).valueOf() ? 1 : -1)
                ) * sortMod;

            default:
                return (a.SalesOrderNo > b.SalesOrderNo ? 1 : -1) * sortMod;
        }
    }

export const emptyDetailLine: SalesOrderDetailLine = {
    BinLocation: null,
    CommentText: "",
    ExplodedKitItem: 'N',
    ExtensionAmt: 0,
    InactiveItem: 'N',
    ItemCode: "",
    ItemCodeDesc: "",
    ItemType: '1',
    LineDiscountPercent: 0,
    LineSeqNo: "",
    PriceLevel: "",
    ProductLine: "",
    ProductType: null,
    PromiseDate: null,
    QuantityAvailable: 0,
    QuantityBackordered: 0,
    QuantityCommitted: 0,
    QuantityImmediateAvailable: 0,
    QuantityOnBackOrder: 0,
    QuantityOnHand: 0,
    QuantityOnPurchaseOrder: 0,
    QuantityOnSalesOrder: 0,
    QuantityOnWOPO: 0,
    QuantityOnWorkOrder: 0,
    QuantityOrdered: 0,
    QuantityPerBill: 0,
    QuantityRequiredForWO: 0,
    QuantityShipped: 0,
    SalesKitLineKey: null,
    SequenceNo: "",
    ShipWeight: 0,
    StandardUnitPrice: 0,
    SuggestedRetailPrice: 0,
    UDF_SHIP_CODE: null,
    UDF_UPC: null,
    UDF_UPC_BY_COLOR: null,
    UnitCost: 0,
    UnitOfMeasure: "",
    UnitOfMeasureConvFactor: 0,
    UnitPrice: 0,
    WarehouseCode: "000",
    image: null,
    LineKey: ''
}

const multiLineAddress = (address: CustomerAddress): string[] => {
    const finalLine = [address.City, address.State, address.CountryCode, address.ZipCode]
        .filter(val => !!val).join(' ');
    return [
        address.AddressLine1 ?? '',
        address.AddressLine2 ?? '',
        address.AddressLine3 ?? '',
        finalLine
    ].filter(line => !!line);
}


export const detailToCartItem = (line: SalesOrderDetailLine): CartItem | null => {
    if (line.InactiveItem !== 'N' || line.ProductType === 'D') {
        return null;
    }
    return {
        itemCode: line.ItemCode,
        quantity: (+line.QuantityOrdered) || 1,
        comment: line.CommentText,
    }
}

export const isCancelledSalesOrder = (so:SalesOrderHeader|null) => {
    if (!so) {
        return false;
    }
    return ['X', 'Z'].includes(so.OrderStatus);
}

export const isOpenSalesOrder = (so: SalesOrderHeader | null) => {
    if (!so) {
        return false;
    }
    return !isCancelledSalesOrder(so) && !isClosedSalesOrder(so);
}

export const isClosedSalesOrder = (so: SalesOrderHeader | null): so is SalesOrderHeader => {
    if (!so) {
        return false;
    }
    return so.OrderStatus === 'C';
}

export const isEditableSalesOrder = (so: SalesOrderHeader | EditableSalesOrder | null): so is EditableSalesOrder => {
    return !!so && (so as EditableSalesOrder).detail !== undefined;
}

export const detailSequenceSorter = (a: SalesOrderDetailLine, b: SalesOrderDetailLine): number => {
    return +a.LineSeqNo === +b.LineSeqNo
        ? defaultDetailSorter(a, b)
        : +a.LineSeqNo - +b.LineSeqNo;
}

export function isDeprecatedUpdateCartItemAction(action: UnknownAction | DeprecatedUpdateCartItemAction): action is DeprecatedUpdateCartItemAction {
    return action.type === 'UPDATE_CART_ITEM';
}
