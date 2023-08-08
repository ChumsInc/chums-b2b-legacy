import React from 'react';
import classNames from "classnames";
import {ALERT_TYPES} from '../constants/actions';
import Badge from "./Badge";
import numeral from 'numeral';
import {BootstrapBGColor} from "../types/colors";


const AlertDismisser = ({onDismiss}: {
    onDismiss: () => void;
}) => {
    return (
        <button type="button" className="btn-close" aria-label="Close"
                onClick={() => onDismiss()}/>
    )
};


const Alert = ({
                   id, type, title, message, context, count, className, onDismiss,
                   children,
               }: {
    id?: number;
    type?: BootstrapBGColor;
    title?: string;
    message?: string;
    context?: string;
    count?: number;
    className?: string;
    onDismiss?: (id: number) => void;
    children?: React.ReactNode;
}) => {

    const dismissible = typeof onDismiss === 'function';
    const _className = classNames('alert my-3', className, {
        'alert-dismissible': dismissible,
        'alert-primary': type === ALERT_TYPES.primary,
        'alert-success': type === ALERT_TYPES.success,
        'alert-info': type === ALERT_TYPES.info || type === undefined,
        'alert-secondary': type === ALERT_TYPES.secondary,
        'alert-danger': type === ALERT_TYPES.danger,
        'alert-warning': type === ALERT_TYPES.warning,
        'alert-light': type === ALERT_TYPES.light,
        'alert-dark': type === ALERT_TYPES.dark,
    });
    return (
        <div className={_className}>
            {!!context && (<strong className="mr-1">[{context}]</strong>)}
            <strong className="me-1">{title || ''}</strong>
            {message ?? children ?? 'Undefined alert'}
            {!!count && count > 1 && (
                <Badge className="ms-3" type={type ?? 'primary'}>
                    {numeral(count).format('0,0')}
                </Badge>
            )}
            {!!id && dismissible && <AlertDismisser onDismiss={() => onDismiss(id)}/>}
        </div>
    )
}

export default Alert;
