import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {deleteUser, loadCustomerAccount, saveUser, updateUser} from '../../ducks/customer/actions';
import ProgressBar from "../ProgressBar";
import AccountUserTable from "./AccountUserTable";
import {selectCustomerLoading, selectCustomerUsers} from "../../ducks/customer/selectors";
import EditAccountUserForm from "./EditAccountUserForm";
import {selectIsEmployee, selectIsRep} from "../../ducks/user/selectors";

const newUser = {id: 0, name: '', email: '', accountType: 4};


const AccountUsers = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectCustomerUsers);
    const loading = useSelector(selectCustomerLoading);
    const isEmployee = useSelector(selectIsEmployee);
    const isRep = useSelector(selectIsRep);
    const [user, setUser] = useState(null);


    const selectUserHandler = (arg) => {
        setUser({...arg})
    }

    const reloadHandler = () => {
        dispatch(loadCustomerAccount({fetchOrders: false}));
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
