import {ORDER_TYPE} from "../constants/orders";
import setHours from 'date-fns/setHours';
import startOfDay from 'date-fns/startOfDay';
import dayjs, {Dayjs} from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'
import {OrderType} from "../ducks/salesOrder/types";
import {SalesOrderHeader, SalesOrderStatus, SalesOrderType} from "b2b-types";
import {isSalesOrderHeader} from "./typeguards";
import {RootState} from "../app/configureStore";



export const calcOrderType = (salesOrder:SalesOrderHeader|null):OrderType|null => {
    if (!isSalesOrderHeader(salesOrder)) {
        return null;
    }
    switch (salesOrder.OrderType) {
    case 'Q':
        return ORDER_TYPE.cart;
    case 'B':
    case 'S':
        return ORDER_TYPE.open;
    case 'M':
        return ORDER_TYPE.master;
    }
    switch (salesOrder.OrderStatus) {
    case 'C':
        return ORDER_TYPE.past;
    case 'O':
    case 'H':
    case 'N':
        return ORDER_TYPE.open;
    }
    return null;
};
export const isCartOrder = (header:SalesOrderHeader|null) => calcOrderType(header) === ORDER_TYPE.cart;
export const isOpenOrder = (header:SalesOrderHeader|null) => calcOrderType(header) === ORDER_TYPE.open;
export const isPastOrder = (header:SalesOrderHeader|null) => calcOrderType(header) === ORDER_TYPE.past;

export const filterOrder = (list:SalesOrderHeader[] = [], salesOrderNo:string):SalesOrderHeader|null => {
    const [salesOrder] = list.filter(so => so.SalesOrderNo === salesOrderNo);
    return salesOrder ?? null;
};

// export const filterOrderFromState = (state:RootState, salesOrderNo:string) => {
//     const {carts, openOrders, invoices} = state;
//     return filterOrder([...carts.list, ...openOrders.list, ...invoices.list], salesOrderNo);
// };

const isInWorkWeek = (date:Date|string|number|Dayjs) => {
    const day = dayjs(date).day();
    return (day > 0 && day < 5)
        || (day === 5 && dayjs(date).hour() < 12);
};

const nextWorkDay = (date:string|number|Date|dayjs.Dayjs = new Date()):string => {
    const d = dayjs(date).add(1, 'day');
    const day = d.day();
    switch (day) {
    case 0: // sunday
            // set date to monday
        return d.day(1).toISOString();
    case 6: // saturday
            // set date to next monday
        return d.day(8).toISOString();
    default:
        return d.toISOString();
    }
}

const addWorkDays = (date:Date|string|number|Dayjs, days:number):string => {
    if (days < 1) {
        return dayjs(date).toISOString();
    }
    let d = dayjs(date);
    for (let i = 0; i < days; i += 1) {
        d = dayjs(nextWorkDay(d));
    }
    return d.toISOString();
}

export const minShipDate = ():string => {
    const _dayjs = dayjs;
    _dayjs.extend(utc);
    _dayjs.extend(timezone);

    let _printDate = _dayjs().tz('America/Denver');
    if (_printDate.hour() >= 12) {
        _printDate = _dayjs().startOf('day').add(24 + 8, 'hours');
    }

    return addWorkDays(_printDate, 5);
}

export const nextShipDate = (shipDate:Date|number|string|Dayjs = new Date()):string => {
    const min = minShipDate();
    if (!isInWorkWeek(shipDate)) {
        const isSunday = dayjs(shipDate).day() === 0;
        shipDate = dayjs(shipDate).day(isSunday ? 1 : 8).toDate().toISOString();
    }
    if (dayjs(shipDate).valueOf() >= dayjs(min).valueOf()) {
        return shipDate.toString();
    }
    return min;
};
