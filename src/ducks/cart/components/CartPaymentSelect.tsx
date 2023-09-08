import React, {useId} from 'react';
import {PaymentType} from "@/types/customer";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl, {FormControlProps} from "@mui/material/FormControl";
import {InputBaseComponentProps} from "@mui/material/InputBase";
import {useSelector} from "react-redux";
import {selectCustomerPaymentCards} from "@/ducks/customer/selectors";
import {PAYMENT_TYPES} from "@/constants/account";

export interface CartPaymentSelectProps extends Omit<FormControlProps, 'onChange'> {
    value: string;
    defaultName?: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
    required?: boolean;
    inputProps?: InputBaseComponentProps
}

export default React.forwardRef(function CartPaymentSelect({
                                                               value,
                                                               defaultName,
                                                               onChange,
                                                               readOnly,
                                                               required,
                                                               inputProps,
                                                               ...formControlProps
                                                           }: CartPaymentSelectProps,
                                                           ref: React.Ref<HTMLDivElement>) {
    const id = useId();
    const paymentCards = useSelector(selectCustomerPaymentCards);

    const customerPaymentCardTypes: PaymentType[] = paymentCards
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
        onChange(ev.target.value);
    }

    return (
        <FormControl fullWidth variant="filled" size="small" {...formControlProps} required={required}>
            <InputLabel id={id}>Payment Method</InputLabel>
            <Select onChange={changeHandler} value={value ?? ''}  ref={ref}
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
})
