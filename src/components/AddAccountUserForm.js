import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import FormGroup from "../common-components/FormGroup";
import TextArea from "../common-components/TextArea";
import Alert from "../common-components/Alert";

export default class AddAccountUserForm extends Component {
    static propTypes = {
        id: PropTypes.number,
        name: PropTypes.string,
        email: PropTypes.string,
        notes: PropTypes.string,
        changed: PropTypes.bool,

        onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    };

    static defaultProps = {
        id: 0,
        name: '',
        email: '',
        notes: '',
        changed: false,
    };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(ev) {
        ev.preventDefault();
        this.props.onSubmit();
    }


    render() {
        const {id, name, email, notes, changed, onChange, onCancel} = this.props;
        return (
            <form onSubmit={this.onSubmit}>
                <Alert type="alert-info" message="An email will be sent to welcome the new user with links to set a password."/>
                <FormGroupTextInput colWidth={8} label="Name" field="name" value={name} onChange={onChange} required/>
                <FormGroupTextInput colWidth={8} label="Email" field="email" type="email" value={email} onChange={onChange} required/>
                <FormGroup colWidth={8} label="Notes" helpText="Enter a message to welcome the new user">
                    <TextArea value={notes} field="notes" onChange={onChange} required/>
                </FormGroup>
                <FormGroup colWidth={8}>
                    <button type="submit" className="btn btn-sm btn-primary mr-1">
                        {id === 0 ? 'Add New User' : 'Update User'}
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-secondary mr-1" onClick={onCancel}>
                        Cancel
                    </button>
                </FormGroup>
                {changed && <Alert type="alert-warning" message="Don't forget to save your changes"/>}
            </form>
        );
    }
}
