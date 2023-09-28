import React, {ButtonHTMLAttributes} from 'react';
import {useAppDispatch} from "../../../app/configureStore";
import {selectCurrentCustomer} from "../../user/selectors";
import {useSelector} from "react-redux";
import {loadCustomer} from "../actions";

export interface ReloadCustomerButton extends ButtonHTMLAttributes<HTMLButtonElement> {
}

const ReloadCustomerButton = ({type, className, onClick, disabled, ...rest}:ButtonHTMLAttributes<HTMLButtonElement>) => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer);

    const clickHandler = () => {
        dispatch(loadCustomer(currentCustomer));
    }

    return (
        <button type={type ?? "button"} className={className ?? "btn btn-sm btn-outline-secondary"}
                onClick={onClick ?? clickHandler} disabled={disabled ?? !currentCustomer}
                {...rest}>
            Reload
        </button>
    )
}

export default ReloadCustomerButton;
