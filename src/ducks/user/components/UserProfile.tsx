import React, {ChangeEvent, FormEvent, Fragment, useEffect, useId, useState} from 'react';
import {useSelector} from 'react-redux';
import {changeUserPassword, logout} from "../actions";
import {AUTH_LOCAL} from "@/constants/app";
import {useAppDispatch} from "@/app/configureStore";
import {selectAuthType, selectProfilePicture, selectUserProfile} from "@/ducks/user/selectors";
import {Editable} from "b2b-types";
import {ExtendedUserProfile} from "../../../_types";

const defaultProfilePic = '/images/chums/Chums_Logo_Booby.png';


type EditableUserProfile = Pick<ExtendedUserProfile, 'name' | 'email'> & Editable;

const UserProfile = () => {
    const dispatch = useAppDispatch();
    const imageUrl = useSelector(selectProfilePicture);
    const profile = useSelector(selectUserProfile);
    const authType = useSelector(selectAuthType);

    const [user, setUser] = useState<EditableUserProfile | null>(profile);
    const [showModal, setShowModal] = useState<boolean>(false);

    const nameInputId = useId();
    const emailInputId = useId();

    useEffect(() => {
        if (!profile) {
            setUser(null);
            return;
        }
        const {name, email} = profile;
        setUser({name, email})
    }, [profile]);

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
    }

    const changeHandler = (field: keyof EditableUserProfile) => (ev: ChangeEvent<HTMLInputElement>) => {
        if (!user) {
            return;
        }
        setUser({...user, [field]: ev.target.value, changed: true});
    }

    const logoutHandler = () => {
        dispatch(logout());
    }

    return (
        <Fragment>

            <div className="user-profile">
                <div className="user-profile-picture">
                    <img src={imageUrl ?? defaultProfilePic}
                         alt="Profile Picture" className="img-thumbnail img-fluid"/>
                </div>
                <div className="user-profile-tasks">
                    <form onSubmit={submitHandler}>
                        <h3>Login Profile</h3>
                        <div className="input-group mb-3">
                            <label className="input-group-text" htmlFor={nameInputId}>Name</label>
                            <input type="text" required
                                   className="form-control" id={nameInputId}
                                   value={user?.name ?? ''} onChange={changeHandler('name')}/>
                        </div>
                        <div className="input-group mb-3">
                            <label className="input-group-text" htmlFor={emailInputId}>Name</label>
                            <input type="text" required
                                   className="form-control" id={emailInputId}
                                   value={user?.email ?? ''} onChange={changeHandler('email')}/>
                        </div>
                        <div className="row g-3">
                            <div className="col-auto">
                                <button type="submit" className="btn btn-primary" disabled={!user?.changed}>
                                    Save Changes
                                </button>
                            </div>
                            <div className="col-auto">
                                <button type="button" className="btn btn-outline-secondary">
                                    Refresh
                                </button>
                            </div>
                            {authType === AUTH_LOCAL && (
                                <div className="col-auto">
                                    <button type="button" className="btn btn-outline-secondary"
                                            onClick={() => setShowModal(!showModal)}>
                                        Change Password
                                    </button>
                                </div>
                            )}
                            <div className="col"/>
                            <div className="col-auto">
                                <button type="button" className="btn btn-outline-danger" onClick={logoutHandler}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default UserProfile;
