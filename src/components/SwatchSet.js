import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {SELL_AS_MIX} from "../constants/actions";
import Swatch from "./Swatch";

export default class SwatchSet extends Component {
    static propTypes = {
        sellAs: PropTypes.number,
        selectedColorCode: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({
            itemCode: PropTypes.string,
            itemQuantity: PropTypes.number,
            colorCode: PropTypes.string,
            color: PropTypes.shape({
                code: PropTypes.string,
                name: PropTypes.string,
            }),
            inactiveItem: PropTypes.number,
            productType: PropTypes.string,
            status: PropTypes.number,
        })),
        swatch_format: PropTypes.string,

        onSelect: PropTypes.func.isRequired,
    };

    static defaultProps = {
        sellAs: SELL_AS_MIX,
        selectedColorCode: '',
        defaultColorCode: '',
        items: [],
        swatch_format: '?',
    };


    render() {
        const {sellAs, items, selectedColorCode, swatch_format, onSelect} = this.props;
        return (
            <div className="swatch-container">
                <div className="swatch-set">
                    {items
                        .filter(item => sellAs === SELL_AS_MIX
                            || !(item.status === 0 || item.inactiveItem === 1 || item.productType === 'D'))
                        .map(item => (
                            <Swatch key={item.id} color={item.color}
                                    itemQuantity={item.itemQuantity || null}
                                    swatchFormat={swatch_format}
                                    active={selectedColorCode === item.color.code}
                                    onClick={(val) => onSelect(val)}/>
                        ))}
                </div>
            </div>
        )
    }
}
