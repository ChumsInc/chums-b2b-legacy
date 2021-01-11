import React from 'react';
import ModalAlert from "./ModalAlert";

const ConfirmDeleteCart = ({SalesOrderNo, onConfirm, onCancel}) => {
    return (
        <ModalAlert onClose={onCancel} title="Confirm">
            <div className="mb-3">Are you sure you want to delete Cart #{SalesOrderNo}?</div>
            <div className="right">
                <button type="button" className="btn btn-sm btn-danger mr-1"
                        onClick={onConfirm}>Delete Cart
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary"
                        onClick={onCancel}>Cancel
                </button>
            </div>
        </ModalAlert>
    );
};

export default ConfirmDeleteCart;
