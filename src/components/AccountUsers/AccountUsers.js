import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {deleteUser, fetchCustomerAccount, saveUser, updateUser} from '../../actions/customer';
import ProgressBar from "../ProgressBar";
import AccountUserTable from "./AccountUserTable";
import {selectCustomerLoading, selectCustomerUsers} from "../../selectors/customer";
import EditAccountUserForm from "./EditAccountUserForm";
import {selectIsEmployee, selectIssRep} from "../../selectors/user";

const newUser = {id: 0, name: '', email: '', accountType: 4};


const AccountUsers = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectCustomerUsers);
    const loading = useSelector(selectCustomerLoading);
    const isEmployee = useSelector(selectIsEmployee);
    const isRep = useSelector(selectIssRep);
    const [user, setUser] = useState(null);


    const selectUserHandler = (arg) => {
        setUser({...arg})
    }

    const reloadHandler = () => {
        dispatch(fetchCustomerAccount({fetchOrders: false}));
    }

    const changeUserHandler = (props) => {
        if (!user) {
            return;
        }
        setUser({...user, ...props, changed: true});
    }
    const saveHandler = () => {
        if (!user) {
            return;
        }
        if (user.id) {
            dispatch(updateUser(user));
            setUser(null);
            return;
        }
        dispatch(saveUser(user));
        setUser(null);
    }

    const deleteHandler = () => {
        if (!user) {
            return;
        }
        if (window.confirm(`Are you sure you want to remove ${user?.email}?`)) {
            dispatch(deleteUser(user));
            setUser(null);
        }
    }

    return (
        <div>
            {loading && <ProgressBar striped/>}
            <div className="row">
                <div className="col-sm-6">
                    <AccountUserTable users={users} onSelectUser={selectUserHandler} currentUser={user?.id}/>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={reloadHandler}>
                        Reload
                    </button>
                </div>
                <div className="col-sm-6">
                    <EditAccountUserForm user={user} onChangeUser={changeUserHandler}
                                         canEdit={isEmployee || isRep}
                                         onSave={saveHandler}
                                         onCancel={() => setUser(null)}
                                         onNewUser={() => setUser({...newUser})}
                                         onDeleteUser={deleteHandler}/>
                </div>
            </div>
        </div>
    )
}

export default AccountUsers;
