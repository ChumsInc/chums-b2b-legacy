import React, {Component} from 'react';
import {connect} from 'react-redux';
import ShipToSelect from "./ShipToSelect";
import FormGroup from "../common-components/FormGroup";

function mapStateToProps({customer}) {
    const {shi} = customer;
    return {};
}

class OrderHeaderShipTo extends Component {

    constructor(props) {
        super(props);
        this.onChangeShipTo = this.onChangeShipTo.bind(this);
    }

    onChangeShipTo({value}) {
        if (value === '') {

        }
        // we can ignore the extra props since this.props.saveCart only sends changes to Cart Name, ShipToCode,
        // and ConfirmTo. After saving the cart, the reloaded sales order replaces the existing data.
        const [props] = this.props.shipToAddresses.filter(st => st.ShipToCode === value);
        this.onChange(props);
    }

    render() {
        return (
            <FormGroup colWidth={8} label="Ship To">
                <ShipToSelect value={ShipToCode || ''} defaultName="Default Address" readOnly={!isCart}
                              onChange={this.onChangeShipTo}/>
            </FormGroup>
        );
    }
}

export default connect(
    mapStateToProps,
)(OrderHeaderShipTo);
