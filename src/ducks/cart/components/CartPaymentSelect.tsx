import React, {useId} from 'react';
import {PaymentType} from "@/types/customer";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {InputBaseComponentProps} from "@mui/material/InputBase";
import {useSelector} from "react-redux";
import {selectCustomerPaymentCards} from "@/ducks/customer/selectors";
import {PAYMENT_TYPES} from "@/constants/account";

export default function CartPaymentSelect({value, defaultName, onChange, readOnly, required, inputProps}: {
    value: string;
    defaultName?: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
    required?: boolean;
    inputProps?: InputBaseComponentProps
}) {
    const id = useId();
    const paymentCards = useSelector(selectCustomerPaymentCards);

    const customerPaymentCardTypes:PaymentType[] = paymentCards
        .filter(cc => PAYMENT_TYPES[cc.PaymentType]?.allowCC && !PAYMENT_TYPES[cc.PaymentType].disabled)
        .map(cc => {
            const paymentType = PAYMENT_TYPES[cc.PaymentType];
            return {
                ...paymentType,
                code: `${paymentType.code}:${cc.CreditCardID}`,
                customerValue: cc.CreditCardID
            }
        });

    const genericPaymentTypes = Object.values(PAYMENT_TYPES).filter(pt => !pt.disabled && !pt.allowCC);

    const changeHandler = (ev: SelectChangeEvent) => {

    }

    return (
        <FormControl fullWidth variant="filled" size="small">
            <InputLabel id={id}>Payment Method</InputLabel>
            <Select onChange={changeHandler} value={value ?? ''}
                    labelId={id}
                    readOnly={readOnly} required={required}
                    inputProps={inputProps}>
                <MenuItem value=""></MenuItem>
                {customerPaymentCardTypes.map(pt => (
                    <MenuItem key={pt.code} value={pt.code}>
                        {pt.description} [{pt.customerValue}]
                    </MenuItem>
                ))}
                {genericPaymentTypes.map(pt => (
                    <MenuItem key={pt.code} value={pt.code}>
                        {pt.description}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
