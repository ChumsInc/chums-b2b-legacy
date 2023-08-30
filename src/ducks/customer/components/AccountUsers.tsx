import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {removeUser, saveUser} from '../actions';
import AccountUserTable from "./AccountUserTable";
import {selectCustomerLoading, selectCustomerUsers} from "../selectors";
import EditAccountUserForm from "./EditAccountUserForm";
import {selectIsEmployee, selectIsRep} from "../../user/selectors";
import {useAppDispatch} from "@/app/configureStore";
import {CustomerUser, Editable} from "b2b-types";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import ReloadCustomerButton from "@/ducks/customer/components/ReloadCustomerButton";

const newUser: CustomerUser = {id: 0, name: '', email: '', accountType: 4};


const AccountUsers = () => {
    const dispatch = useAppDispatch();
    const users = useSelector(selectCustomerUsers);
    const loading = useSelector(selectCustomerLoading);
    const isEmployee = useSelector(selectIsEmployee);
    const isRep = useSelector(selectIsRep);
    const [user, setUser] = useState<(CustomerUser & Editable) | null>(null);


    const selectUserHandler = (arg: CustomerUser) => {
        setUser({...arg})
    }

    const changeUserHandler = (props: Partial<CustomerUser>) => {
        if (!user) {
            return;
        }
        setUser({...user, ...props, changed: true});
    }
    const saveHandler = () => {
        if (!user) {
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
            dispatch(removeUser(user));
            setUser(null);
        }
    }

    return (
        <Box sx={{mt: '2'}}>
            <div className="row">
                <div className="col-sm-6">
                    <div>
                        <ReloadCustomerButton/>
                    </div>
                    {loading && <LinearProgress variant={"indeterminate"} sx={{my: 1}}/>}
                    <AccountUserTable users={users} onSelectUser={selectUserHandler} currentUser={user?.id}/>
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
        </Box>
    )
}

export default AccountUsers;
