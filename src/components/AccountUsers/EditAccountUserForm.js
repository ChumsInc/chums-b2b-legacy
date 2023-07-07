import React from 'react';
import Alert from "../../common-components/Alert";
import TextareaAutosize from "react-textarea-autosize";
import BusinessIcon from "@mui/icons-material/Business";
import {useSelector} from "react-redux";
import {selectPermittedShipToAddresses} from "../../ducks/customer/selectors";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// export interface EditAccountUserFormProps {
//     user: (ExtendedCustomerUser & Editable) | null;
//     canEdit?: boolean;
//     onChangeUser: (props: Partial<ExtendedCustomerUser>) => void;
//     onSave: () => void;
//     onCancel: () => void;
//     onNewUser: () => void;
//     onDeleteUser: () => void;
// }

const EditAccountUserForm = ({
                                 user,
                                 canEdit,
                                 onChangeUser,
                                 onSave,
                                 onCancel,
                                 onNewUser,
                                 onDeleteUser
                             }) => {
    const shipToAddresses = useSelector(selectPermittedShipToAddresses);
    const changeHandler = (field) => (ev) => {
        onChangeUser({[field]: ev.target.value});
    }

    const submitHandler = (ev) => {
        ev.preventDefault();
        onSave();
    }
    if (!user) {
        return (
            <button type="button" className="btn btn-outline-secondary btn-sm"
                    disabled={!canEdit}
                    onClick={onNewUser}>
                New User
            </button>
        )
    }

    return (
        <form onSubmit={submitHandler}>
            <h3>
                {user.id === 0 && (<span>New User</span>)}
                {user.id !== 0 && (<span>Update User</span>)}
            </h3>
            {user.id === 0 && (
                <Alert type="alert-info"
                       message="An email will be sent to welcome the new user with links to set a password."/>
            )}
            <div className="input-group input-group-sm">
                <span className="input-group-text">
                    <span className="bi-person"/>
                    <label htmlFor="user-form--name" className="visually-hidden">User Name</label>
                </span>
                <input type="text" className="form-control form-control-sm" id="user-form--name"
                       value={user.name} onChange={changeHandler('name')} title="User Name"
                       disabled={user.accountType !== 4} required
                       placeholder="Full Name"/>
            </div>
            <small className="text-muted">Please enter the users full name</small>

            <div className="input-group input-group-sm mt-1">
                <span className="input-group-text">
                    <span className="bi-at"/>
                    <label htmlFor="user-form--email" className="visually-hidden">User Email</label>
                </span>
                <input type="email" className="form-control form-control-sm" id="user-form--email"
                       value={user.email} onChange={changeHandler('email')} title="User Email"
                       disabled={user.accountType !== 4} required
                       placeholder="email address"/>
            </div>

            {user.id === 0 && (
                <div className="mt-3">
                    <TextareaAutosize value={user.notes ?? ''} onChange={changeHandler('notes')}
                                      minRows={2} maxRows={5} required
                                      className="form-control form-control-sm" id="user-form--notes"/>
                    <small className="text-muted">Add a welcome message to the new user</small>
                </div>
            )}
            <div className="row g-3 mt-3">
                <div className="col-auto">
                    <button type="submit" className="btn btn-sm btn-primary" disabled={!canEdit}>
                        Save
                    </button>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
                {user.id !== 0 && (
                    <div className="col-auto">
                        <button type="button" className="btn btn-sm btn-outline-danger"
                                disabled={!canEdit} onClick={onDeleteUser}>
                            Delete
                        </button>
                    </div>
                )}
            </div>
            <hr/>
            <div className="mt-3">
                <h4>Access Permissions</h4>
                <table className="table table-sm">
                    <thead>
                    <tr>
                        <th />
                        <th>Ship To Code</th>
                        <th>Name</th>
                        <th>Location</th>
                    </tr>
                    </thead>
                    <tbody>
                    {user.shipToCode?.length === 0 && (
                        <tr>
                            <td><BusinessIcon/></td>
                            <td colSpan={3}>All Locations</td>
                        </tr>
                    )}
                    {shipToAddresses
                        .filter(st => user.shipToCode?.includes(st.ShipToCode))
                        .map(shipTo => (
                            <tr>
                                <td><ShoppingCartIcon/></td>
                                <td>{shipTo.ShipToCode}</td>
                                <td>{shipTo.ShipToName}</td>
                                <td>{shipTo.ShipToCity}, {shipTo.ShipToState} {shipTo.ShipToCountryCode}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </form>
    )
}

export default EditAccountUserForm;
