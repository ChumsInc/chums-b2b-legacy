import React from 'react';
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import Alert from "../common-components/Alert";
import ProgressBar from "./ProgressBar";
import ModalAlert from "./ModalAlert";
import Button from "../common-components/Button";

const DuplicateCartAlert = ({SalesOrderNo, newCartName, loading = false, onSetCartName, onConfirm, onCancel}) => {
    return (
        <ModalAlert onClose={onCancel} title="Confirm">
            <div className="mb-3">Are you sure you want to duplicate Order #{SalesOrderNo}?</div>
            <div className="mb-3">
                <FormGroupTextInput label="New Cart Name"
                                    onChange={({value}) => onSetCartName(value)}
                                    value={newCartName} maxLength={30}/>
            </div>
            <Alert type="alert-light" title="Note:">
                Any discontinued items will no longer be available. Please check your new order for
                accuracy.
                Comments will not copy to the new order - you may need to add those manually, or copy them
                from this order.
            </Alert>
            {!loading && (
                <div className="right">
                    <Button color="btn-primary" onClick={onConfirm} className="mr-3">Duplicate Order</Button>
                    <Button color="btn-outline-secondary" onClick={onCancel} className="mr-3">Cancel</Button>
                </div>
            )}
            {loading && <ProgressBar striped={true}/>}
        </ModalAlert>
    );
};

export default DuplicateCartAlert;
