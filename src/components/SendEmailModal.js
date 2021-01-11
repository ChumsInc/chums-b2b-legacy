import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {orderHeaderPropType} from "../constants/myPropTypes";
import {confirmEmailSent} from "../actions/salesOrder";
import ModalAlert from "./ModalAlert";
import ProgressBar from "./ProgressBar";

class SendEmailModal extends Component {
    static propTypes = {
        sending: PropTypes.bool,
        confirmed: PropTypes.bool,
        envelope: PropTypes.shape({
            from: PropTypes.string,
            to: PropTypes.arrayOf(PropTypes.string)
        }),
        accepted: PropTypes.arrayOf(PropTypes.string),
        rejected: PropTypes.arrayOf(PropTypes.string),
        confirmEmailSent: PropTypes.func.isRequired,
    };

    static defaultProps = {
        sending: false,
        confirmed: false,
        envelope: {
            from: '',
            to: []
        },
        accepted: [],
        rejected: [],
    };

    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
    }

    onClose() {
        this.props.confirmEmailSent();
    }

    render() {
        const {sending, envelope, accepted, rejected} = this.props;
        return (
            <ModalAlert onClose={this.onClose} title="Sending Email">
                {sending && <ProgressBar striped={true}/>}
                <table className="table table-sm">
                    <tbody>
                    <tr><th>From</th><td>{envelope.from}</td></tr>
                    <tr><th>To</th><td>{envelope.to.join(', ')}</td></tr>
                    <tr><th>Accepted</th><td>{accepted.length ? accepted.join(', ') : '-'}</td></tr>
                    <tr><th>Rejected</th><td>{rejected.length ? rejected.join(', ') : '-'}</td></tr>
                    </tbody>
                </table>
            </ModalAlert>
        );
    }
}

const mapStateToProps = ({salesOrder}) => {
    const {sending, accepted, rejected, envelope, messageId, confirmed} = salesOrder.sendEmailStatus;
    return {
        sending,
        accepted,
        rejected,
        envelope,
        messageId,
        confirmed,
    }
};

const mapDispatchToProps = {
    confirmEmailSent,
};

export default connect(mapStateToProps, mapDispatchToProps)(SendEmailModal);
