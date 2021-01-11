import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {fetchPromoCode, setPromoCode} from '../actions/promo_codes';
import TextInput from "../common-components/TextInput";

function mapStateToProps(state) {
    const {code, description, requiredItems, loading} = state.promo_code;
    return {code, description, requiredItems, loading};
}

const mapDispatchToProps = {
    setPromoCode,
    fetchPromoCode,
};

class OrderPromoCode extends Component {
    static propTypes = {
        code: PropTypes.string,
        description: PropTypes.string,
        loading: PropTypes.bool,
        disabled: PropTypes.bool,
        setPromoCode: PropTypes.func.isRequired,
        fetchPromoCode: PropTypes.func.isRequired,
    };
    static defaultProps = {
        UDF_PROMO_DEAL: '',
        code: '',
        description: '',
        loading: false,
        disabled: false,
    };

    constructor(props) {
        super(props);
        this.onChangeCode = this.onChangeCode.bind(this);
        this.onApplyPromoCode = this.onApplyPromoCode.bind(this);
    }

    onChangeCode({field, value}) {
        this.props.setPromoCode(value);
    }

    onApplyPromoCode() {
        this.props.fetchPromoCode(this.props.code);
    }

    render() {
        const {UDF_PROMO_DEAL, code, description, loading, disabled} = this.props;
        return (
            <Fragment>
                <div className="input-group">
                    <TextInput value={UDF_PROMO_DEAL || code} onChange={this.onChangeCode} disabled={disabled}
                               placeholder="Promo Code"/>
                    <div className="input-group-append">
                        {!disabled && (
                            <button type="button" className="btn btn-sm btn-primary"
                                    onClick={this.onApplyPromoCode}
                                    disabled={!code || !!loading}>
                                Apply
                            </button>
                        )}
                    </div>
                </div>
                <small className="form-text text-muted">{description}</small>
            </Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderPromoCode);
