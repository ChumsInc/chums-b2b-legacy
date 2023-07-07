import React from "react";
import TextInput from "../../../common-components/TextInput";
import {useAppDispatch} from "../../../app/configureStore";
import {useSelector} from "react-redux";
import {selectShippingAccount} from "../selectors";
import {setShippingAccount} from "../actions";

const CustomerShippingAccount = ({readOnly = false}) => {
    const dispatch = useAppDispatch();
    const shippingAccount = useSelector(selectShippingAccount);

    const clickHandler = (ev) => {
        if (readOnly) {
            return;
        }
        dispatch(setShippingAccount({...shippingAccount, enabled: ev.target.checked}))
    };

    const changeHandler = (value) => {
        if (readOnly) {
            return;
        }
        dispatch(setShippingAccount({...shippingAccount, value}))
    }

    return (
        <div className="input-group input-group-sm">
            <div className="input-group-text">
                <span onClick={() => onClick()}>Use your account</span>
            </div>
            <div className="input-group-text">
                <input type="checkbox" checked={shippingAccount.enabled}
                       onChange={clickHandler} disabled={readOnly}/>
            </div>
            <TextInput onChange={changeHandler}
                       value={value}
                       disabled={!enabled} readOnly={readOnly} required={true}
                       placeholder="Shipping Account" />
        </div>
    )
};

export default CustomerShippingAccount;
