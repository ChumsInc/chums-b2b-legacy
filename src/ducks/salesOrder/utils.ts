import {SalesOrderDetailLine, SalesOrderHeader} from "b2b-types";

export const defaultDetailSorter = (a: SalesOrderDetailLine, b: SalesOrderDetailLine) => {
    return +a.LineKey - +b.LineKey;
}

export const salesOrderSorter = (a: SalesOrderHeader, b: SalesOrderHeader) => {
    return a.SalesOrderNo > b.SalesOrderNo ? 1 : -1;
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
