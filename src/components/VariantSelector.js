import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import {connect} from 'react-redux';
import ClickOutside from 'react-onclickoutside';
import classNames from "classnames";
import {getMSRP, getPrices, getSalesUM, sortVariants} from "../utils/products";
import numeral from 'numeral';

const VariantItem = ({variant, selected = false, loggedIn = false, onClick, priceCodes = []}) => {
    const className = classNames({
        variant: true,
        'variant-button': true,
        'btn': true,
        'btn-outline-secondary': !selected,
        'btn-primary': selected
    });

    const prices = loggedIn
        ? getPrices({product: variant.product, priceCodes})
        : getMSRP(variant.product);
    const salesUM = getSalesUM(variant.product);

    return (
        <div className={className} onClick={() => onClick(variant)}>
            <div className="title" dangerouslySetInnerHTML={{__html: variant.title}}/>
            <div className="price">
                $ {prices.map(price => numeral(price).format('0.00')).join(' - ')}
                {' '}
                ({salesUM || 'EA'})
            </div>
        </div>
    )
};

class VariantSelector extends Component {
    static propTypes = {
        productId: PropTypes.number.isRequired,
        variants: PropTypes.array,
        selectedVariantId: PropTypes.number,
        priceCodes: PropTypes.array,
        loggedIn: PropTypes.bool,

        onSelect: PropTypes.func,
    };
    static defaultProps = {
        productId: 0,
        variants: [],
        selectedVariantId: 0,
        priceCodes: [],
        loggedIn: false,
    };

    state = {
        show: false,
    };

    constructor(props) {
        super(props);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.onClickSelector = this.onClickSelector.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    handleClickOutside() {
        this.setState({show: false});
    }

    onClickSelector() {
        const {show} = this.state;
        this.setState({show: !show});
    }

    onSelect(id) {
        this.setState({show: false}, () => {
            this.props.onSelect(id);
        });
    }

    render() {
        const {show} = this.state;
        const {productId, variants, selectedVariantId, priceCodes, loggedIn} = this.props;
        const [variant = {}] = variants.filter(v => v.id === selectedVariantId);

        if (!variant.product) {
            return null;
        }
        const prices = loggedIn
            ? getPrices({product: variant.product, priceCodes})
            : getMSRP(variant.product);
        const salesUM = getSalesUM(variant.product);

        if (variants.filter(v => !!v.status && !!v.product.status).length <= 1) {
            return (
                <div className="variants-container">
                    <div className="btn btn-outline-secondary variant-selector">
                        <div>
                            <span className="title"
                                  dangerouslySetInnerHTML={{__html: variant.title || 'Select an option'}}/>

                            <span className="price ms-3">
                                $ {prices.map(price => numeral(price).format('0.00')).join(' - ')}
                                {' '}
                                ({salesUM || 'EA'})
                            </span>
                        </div>
                        {/*{variant.title || 'Select an Option'}*/}
                    </div>
                </div>
            )
        }
        return (
            <div className="variants-container dropdown">
                <div className={classNames("btn-group", {show})}>
                    <button type="button" disabled={variants.filter(v => !!v.status && !!v.product.status).length <= 1}
                            className="btn btn-outline-secondary dropdown-toggle variant-selector"
                            onClick={this.onClickSelector}>
                        <div>
                            <span className="title"
                                  dangerouslySetInnerHTML={{__html: variant.title || 'Select an option'}}/>

                            <span className="price ms-3">
                                $ {prices.map(price => numeral(price).format('0.00')).join(' - ')}
                                {' '}
                                ({salesUM || 'EA'})
                            </span>
                        </div>
                        {/*{variant.title || 'Select an Option'}*/}
                    </button>
                    <div className={classNames("dropdown-menu", {show})}>
                        {variants.filter(v => !!v.status && !!v.product.status)
                            .sort(sortVariants)
                            .map(variant => <VariantItem key={variant.id} variant={variant}
                                                         selected={variant.id === selectedVariantId}
                                                         onClick={this.onSelect}
                                                         priceCodes={priceCodes} loggedIn={loggedIn}/>)
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default ClickOutside(VariantSelector);
