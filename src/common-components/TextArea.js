import React, {PureComponent, createRef} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TextAreaAutosize from 'react-textarea-autosize';




export default class TextArea extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
        field: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
    };

    static defaultProps = {
        value: '',
        className: 'form-control form-control-sm',
        style: {},
    };

    state = {
        defaultHeight: 0,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.ref = createRef();
    }

    onChange(ev) {
        const {field} = this.props;
        this.props.onChange({field, value: ev.target.value});
    }

    render() {
        //unused constants above are removed so that ...rest can be passed to input.
        const {onChange, onBlur, value, field, className, style = {}, ...rest} = this.props;
        const _className = {
            'form-control': true,
            'form-control-sm': !className.split(' ').includes('form-control-lg'),
        };

        return (
            <TextAreaAutosize value={value} onChange={this.onChange} className={classNames(className, _className)}
                              style={style}
                              {...rest} />
        );
    }
}
