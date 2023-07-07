import React from 'react';
import classNames from "classnames";
import {ALERT_TYPES} from '../constants/actions';
import Badge from "./Badge";
import numeral from 'numeral';


const AlertDismisser = ({onDismiss}) => {
    return (
        <button type="button" className="btn-close" aria-label="Close"
                onClick={() => onDismiss()}/>
    )
};


/**
 *
 * @param {number} [id]
 * @param {AlertType} [type]
 * @param {string} title
 * @param {string} message
 * @param {string} [context]
 * @param {number} count
 * @param {string} className
 * @param {(number) => void} onDismiss
 * @param {Node} [children]
 * @return {JSX.Element}
 * @constructor
 */
const Alert = ({
                   id, type, title, message, context, count, className, onDismiss,
                   children,
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
            {message || children}
            {count > 1 && (
                <Badge className="ms-3" type={type ?? 'primary'}>
                    {numeral(count).format('0,0')}
                </Badge>
            )}
            {dismissible && <AlertDismisser onDismiss={() => onDismiss(id)}/>}
        </div>
    )
}

export default Alert;
