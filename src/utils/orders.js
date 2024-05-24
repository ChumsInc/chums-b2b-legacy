import {ORDER_TYPE} from "../constants/orders";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'


export const calcOrderType = ({OrderType, OrderStatus}) => {
    switch (OrderType) {
    case 'Q':
        return ORDER_TYPE.cart;
    case 'B':
    case 'S':
        return ORDER_TYPE.open;
    case 'M':
        return ORDER_TYPE.master;
    }
    switch (OrderStatus) {
    case 'C':
        return ORDER_TYPE.past;
    case 'S':
    case 'A':
    case 'O':
    case 'H':
    case 'N':
        return ORDER_TYPE.open;
    case 'Q':
        return ORDER_TYPE.cart;
    }
    return 'na'
};

export const isCartOrder = ({OrderType, OrderStatus}) => calcOrderType({OrderType, OrderStatus}) === ORDER_TYPE.cart;
export const isOpenOrder = ({OrderType, OrderStatus}) => calcOrderType({OrderType, OrderStatus}) === ORDER_TYPE.open;
export const isPastOrder = ({OrderType, OrderStatus}) => calcOrderType({OrderType, OrderStatus}) === ORDER_TYPE.past;

export const filterOrder = (list = [], salesOrderNo) => {
    const [salesOrder] = list.filter(so => so.SalesOrderNo === salesOrderNo);
    return salesOrder || {};
};

export const filterOrderFromState = (state, salesOrderNo) => {
    const {carts, openOrders, pastOrders} = state;
    return filterOrder([...carts.list, ...openOrders.list, ...pastOrders.list], salesOrderNo);
};

const isInWorkWeek = (date) => {
    const day = dayjs(date).day();
    return (day > 0 && day < 5)
        || (day === 5 && dayjs(date).hour() < 12);
};

/**
 *
 * @param {string|number|Date|dayjs.Dayjs} date
 * @return {string}
 */
const nextWorkDay = (date = new Date()) => {
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
const addWorkDays = (date, days) => {
    if (days < 1) {
        return date;
    }
    let d = dayjs(date);
    for (let i = 0; i < days; i += 1) {
        d = dayjs(nextWorkDay(d));
    }
    return d.toISOString();
}
export const minShipDate = () => {
    const _dayjs = dayjs;
    _dayjs.extend(utc);
    _dayjs.extend(timezone);

    let _printDate = _dayjs().tz('America/Denver');
    if (_printDate.hour() >= 12) {
        _printDate = _dayjs().startOf('day').add(24 + 8, 'hours');
    }

    return addWorkDays(_printDate, 5);
}

export const nextShipDate = (shipDate = new Date()) => {
    const min = minShipDate();
    if (!isInWorkWeek(shipDate)) {
        const isSunday = dayjs(shipDate).day() === 0;
        shipDate = dayjs(shipDate).day(isSunday ? 1 : 8).toDate();
    }
    if (dayjs(shipDate).valueOf() >= dayjs(min).valueOf()) {
        return shipDate;
    }
    return min;
};
