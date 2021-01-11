import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {noop} from '../utils/general';
import TextInput from "./TextInput";

class PasswordInput extends Component {
    static propTypes = {
        value: PropTypes.string,
        field: PropTypes.string,
        className: PropTypes.string,
        helpText: PropTypes.string,
        showValidation: PropTypes.bool,

        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        value: '',
        field: '',
        className: '',
        helpText: '',
        showValidation: false,

        onChange: noop,
    };


    state = {
        visible: false,
    };

    constructor(props) {
        super(props);
        this.onToggleVisible = this.onToggleVisible.bind(this);
    }

    onToggleVisible() {
        this.setState({visible: !this.state.visible});
    }

    onChange({field, value}) {
        this.props.onChange({[field]: value});
    }

    static defaultValidation(value) {
        return {
            score: 2 + value.length > 8 ? 2 : 0,
            feedback: {
                warning: null,
                suggestions: null
            },
            valid: value.length > 8
        };
    }

    static getValidation(value = '') {
        if (value === '') {
            return {
                score: 0,
                feedback: {},
                className: '',
                valid: false,
            };
        }
        const validation = !!global.zxcvbn
            ? global.zxcvbn(value, ['chums', 'chums.com'])
            : PasswordInput.defaultValidation(value);

        switch (validation.score) {
        default:
        case 0:
        case 1:
            validation.valid = false;
            validation.className = 'border-danger text-danger';
            break;

        case 2:
            validation.className = 'border-warning';
            validation.valid = true;
            break;

        case 3:
            validation.className = 'border-info';
            validation.valid = true;
            break;

        case 4:
            validation.className = 'border-success';
            validation.feedback = 'Thanks for choosing a secure password';
            validation.valid = true;
            break;
        }
        return validation;
    }

    render() {
        const {className, value, field, showValidation, helpText, forwardRef, ...rest} = this.props;
        const {visible} = this.state;
        const validation = showValidation
            ? PasswordInput.getValidation(value)
            : {feedback: {}};

        const message = [helpText, validation.feedback.warning, validation.feedback.suggestions]
            .filter(val => !!val)
            .join('; ');


        return (
            <Fragment>
                <div className="input-group input-group-sm input-group-password">
                    <TextInput type={visible ? 'text' : 'password'} value={value} field={field}
                               className={validation.className}
                               onChange={this.onChange} {...rest}/>
                    <div className="input-group-append">
                        <button type="button" className="btn btn-outline-secondary"
                                onMouseDown={this.onToggleVisible} onMouseUp={this.onToggleVisible}
                                onTouchStart={this.onToggleVisible} onTouchEnd={this.onToggleVisible}>
                            <span className="material-icons">visibility</span>
                        </button>
                    </div>
                </div>
                {message && <small className="form-text text-muted">{message}</small>}
            </Fragment>
        );
    }
}

export default PasswordInput;
