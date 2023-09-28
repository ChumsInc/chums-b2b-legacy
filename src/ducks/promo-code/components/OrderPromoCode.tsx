import React, {Fragment, useEffect, useId, useState} from 'react';
import {useSelector} from 'react-redux';
import {useAppDispatch} from "../../../app/configureStore";
import {selectCurrentPromoCode, selectPromoCodesLoading} from "../selectors";
import {loadPromoCode} from "../actions";
import {selectSalesOrderProcessing} from "../../salesOrder/selectors";
import {selectCartPromoCode} from "../../cart/selectors";
import {applyPromoCode} from "../../cart/actions";

const OrderPromoCode = ({disabled}: {
    disabled?: boolean;
}) => {
    const dispatch = useAppDispatch();
    const promoCode = useSelector(selectCurrentPromoCode);
    const cartPromoCode = useSelector(selectCartPromoCode);
    const loading = useSelector(selectPromoCodesLoading);
    const saving = useSelector(selectSalesOrderProcessing);
    const [code, setCode] = useState<string>(promoCode?.promo_code ?? '');
    const id = useId();

    useEffect(() => {
        if (promoCode?.active && cartPromoCode !== promoCode.promo_code) {
            dispatch(applyPromoCode(promoCode));
        }
    }, [promoCode, cartPromoCode]);

    const onApplyPromoCode = () => {
        if (!promoCode && !!code.trim()) {
            dispatch(loadPromoCode(code));
            return;
        }
        if (promoCode) {
            dispatch(applyPromoCode(promoCode));
        }
    }

    return (
        <>
            <div className="input-group input-group-sm">
                <label className="input-group-text" htmlFor={id}>Promo Code</label>
                <input type="text" className="form-control form-control-sm" id={id}
                       value={code} onChange={(ev) => setCode(ev.target.value)} placeholder="Promo Code"/>
                <div className="input-group-append">
                    {!disabled && (
                        <button type="button" className="btn btn-sm btn-primary"
                                onClick={onApplyPromoCode}
                                disabled={!code || loading || saving !== 'idle'}>
                            Apply
                        </button>
                    )}
                </div>
            </div>
            <small className="form-text text-muted">{promoCode?.description ?? ''}</small>
        </>
    );
}

export default OrderPromoCode;
