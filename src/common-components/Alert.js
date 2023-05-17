import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import {ALERT_TYPES} from '../constants/actions';
import Badge from "./Badge";
import numeral from 'numeral';


const AlertDismisser = ({onDismiss}) => {
    return (
        <button type="button" className="btn-close" aria-label="Close"
                onClick={() => onDismiss()} />
    )
};

export default class Alert extends Component {
    static propTypes = {
        id: PropTypes.number,
        type: PropTypes.oneOf(['alert-primary', 'alert-success', 'alert-info', 'alert-secondary', 'alert-danger',
            'alert-warning', 'alert-light', 'alert-dark', 'alert-todo']),
        title: PropTypes.string,
        message: PropTypes.string,
        context: PropTypes.string,
        count: PropTypes.number,
        className: PropTypes.string,
        onDismiss: PropTypes.func,
    };

    static defaultProps = {
        id: 0,
        type: 'alert-info',
        title: '',
        message: '',
        className: '',
        context: '',
        count: 1,
    };

    constructor(props) {
        super(props);
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss() {
        const {id} = this.props;
        this.props.onDismiss(id);
    }

    render() {
        const {title, message, type, onDismiss, children, className, context, count} = this.props;
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
            'alert-todo': type === ALERT_TYPES.todo,
        });
        return (
            <div className={_className}>
                {!!context && (<strong className="mr-1">[{context}]</strong>)}
                <strong className="me-1">{title || ''}</strong>
                {message || children}
                {count > 1 && (
                    <Badge className="ms-3"
                           type={(type || '').replace('alert-', '')}>
                        {numeral(count).format('0,0')}
                    </Badge>

                )}
                {dismissible && <AlertDismisser onDismiss={this.onDismiss}/>}
            </div>
        )
    }
}
