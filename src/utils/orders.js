import {ORDER_TYPE} from "../constants/orders";
import addHours from 'date-fns/addHours';
import getISODay from 'date-fns/getISODay';
import getHours from 'date-fns/getHours';
import setDay from 'date-fns/setDay';
import setHours from 'date-fns/setHours';
import startOfDay from 'date-fns/startOfDay';
import addBusinessDays from 'date-fns/addBusinessDays';
import format from 'date-fns/format';
import differenceInBusinessDays from 'date-fns/differenceInBusinessDays';


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
    const day = getISODay(date);
    return (day > 0 && day < 5)
        || (day === 5 && getHours(date) < 12);
};

export const minShipDate = () => {
    const d = new Date();
    let printDate = setHours(startOfDay(d), 24 + 8); // tomorrow morning at 8am

    //changed to 5 business days per Andrew, 3/31/2022
    return addBusinessDays(printDate, 5);

    if (!isInWorkWeek(printDate)) {
        printDate = setDay(printDate, printDate.getDay() === 0 ? 1 : 8); //next monday
    }
    const pickDate = addHours(printDate, 4); //print by noon
    let shipDate = addHours(pickDate, 24); // ship by noon the next day
    if (!isInWorkWeek(shipDate)) {
        shipDate = setDay(shipDate, 8); // next monday
    }
    return shipDate;
}
export const nextShipDate = (d = new Date()) => {
    const min = minShipDate();
    if (!isInWorkWeek(d)) {
        d = setDay(d, d.getDay() === 0 ? 1 : 8); //next monday
    }
    if (d.valueOf() >= min.valueOf()) {
        return d;
    }
    return min;

    let printDate = setHours(startOfDay(d), 24 + 8); // tomorrow morning at 8am
    if (!isInWorkWeek(printDate)) {
        printDate = setDay(printDate, 8); //next monday
    }
    const pickDate = addHours(printDate, 4); //print by noon
    let shipDate = addHours(pickDate, 24); // ship by noon the next day
    if (!isInWorkWeek(shipDate)) {
        shipDate = setDay(shipDate, 8); // next monday
    }
    return shipDate;

};
