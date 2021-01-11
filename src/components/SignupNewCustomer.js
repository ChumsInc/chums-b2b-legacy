import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import FormGroup from "../common-components/FormGroup";
import ProgressBar from "./ProgressBar";

export default class SignupNewCustomer extends Component {
    static propTypes = {};

    static defaultProps = {};

    state = {
        name: '',
        email: '',
        telephone: '',
        notes: '',
    };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    onSubmit(ev) {
        ev.preventDefault();
    }

    onChange({field, value}) {
        this.setState({[field]: value});
    }
    render() {
        const {name, email, telephone, notes} = this.state;
        return (
            <Fragment>
                <h3>I'd like to be a customer:</h3>
                <form onSubmit={this.onSubmit} >
                    <FormGroupTextInput label="Name" type="text" colWidth={8} field="name" value={name} onChange={this.onChange} />
                    <FormGroupTextInput label="E-Mail Address" type="email" colWidth={8} field="email" value={email} onChange={this.onChange} />
                    <FormGroupTextInput label="Telephone No" type="tel" colWidth={8} field="telephone" value={telephone}  onChange={this.onChange}/>
                    <FormGroup colWidth={8} label="Comments">
                        asdasd
                    </FormGroup>
                </form>
            </Fragment>
        );
    }
}
