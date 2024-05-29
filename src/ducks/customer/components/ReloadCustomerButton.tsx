import React from 'react';
import {useAppDispatch} from "../../../app/configureStore";
import {selectCurrentCustomer} from "../../user/selectors";
import {useSelector} from "react-redux";
import {loadCustomer} from "../actions";
import Button, {ButtonProps} from "@mui/material/Button";

const ReloadCustomerButton = ({type, onClick, disabled, ...rest}: ButtonProps) => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer);

    const clickHandler = () => {
        dispatch(loadCustomer(currentCustomer));
    }

    return (
        <Button type={type ?? "button"} variant="text"
                onClick={onClick ?? clickHandler} disabled={disabled ?? !currentCustomer}
                {...rest}>
            Reload
        </Button>
    )
}

export default ReloadCustomerButton;
