import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const BTN_SUBMIT = 'submit';
export const BTN_PRIMARY = 'btn-primary';
export const BTN_SUCCESS = 'btn-success';
export const BTN_INFO = 'btn-info';
export const BTN_SECONDARY = 'btn-secondary';
export const BTN_DANGER = 'btn-danger';
export const BTN_WARNING = 'btn-warning';
export const BTN_LIGHT = 'btn-light';
export const BTN_DARK = 'btn-dark';
export const BTN_OUTLINE_PRIMARY = 'btn-outline-primary';
export const BTN_OUTLINE_SUCCESS = 'btn-outline-success';
export const BTN_OUTLINE_INFO = 'btn-outline-info';
export const BTN_OUTLINE_SECONDARY = 'btn-outline-secondary';
export const BTN_OUTLINE_DANGER = 'btn-outline-danger';
export const BTN_OUTLINE_WARNING = 'btn-outline-warning';
export const BTN_OUTLINE_LIGHT = 'btn-outline-light';
export const BTN_OUTLINE_DARK = 'btn-outline-dark';

export default class Button extends Component {
    static propTypes = {
        type: PropTypes.oneOf(['button', BTN_SUBMIT, 'reset']),
        size: PropTypes.oneOf(['btn-sm', 'btn-std', 'btn-lg']),
        color: PropTypes.oneOf([
            BTN_PRIMARY, BTN_SUCCESS, BTN_INFO, BTN_SECONDARY, BTN_DANGER, BTN_WARNING, BTN_LIGHT, BTN_DARK,
            BTN_OUTLINE_PRIMARY, BTN_OUTLINE_SUCCESS, BTN_OUTLINE_INFO, BTN_OUTLINE_SECONDARY, BTN_OUTLINE_DANGER,
            BTN_OUTLINE_WARNING, BTN_OUTLINE_LIGHT, BTN_OUTLINE_DARK
        ]),
        className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        content: PropTypes.string,
        onClick: PropTypes.func,
    }
    static defaultProps = {
        type: 'button',
        size: 'btn-sm',
        color: BTN_SECONDARY,
        className: '',
    }
    render() {
        const {type, size, color, className, content, children, ...rest} = this.props;
        const _className = classNames('btn', {
            [size]: !!size,
            [color]: !!color,
        }, className);
        return (
            <button type={type} className={_className} {...rest}>
                {content || children || ''}
            </button>
        );
    }
}


