import React, {ChangeEvent, FormEvent, useEffect, useId, useState} from 'react';
import {useSelector} from 'react-redux';
import {loadProfile, logout, saveUserProfile} from "../actions";
import {AUTH_LOCAL} from "../../../constants/app";
import {useAppDispatch} from "../../../app/configureStore";
import {selectAuthType, selectProfilePicture, selectUserLoading, selectUserProfile} from "../selectors";
import {Editable} from "b2b-types";
import {ExtendedUserProfile} from "../../../types/user";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {Button, TextField} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";

const defaultProfilePic = '/images/chums/Chums_Logo_Booby.png';


type EditableUserProfile = Pick<ExtendedUserProfile, 'name' | 'email'> & Editable;

const UserProfile = () => {
    const dispatch = useAppDispatch();
    const imageUrl = useSelector(selectProfilePicture);
    const profile = useSelector(selectUserProfile);
    const authType = useSelector(selectAuthType);
    const loading = useSelector(selectUserLoading);

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
        if (!user) {
            return;
        }
        dispatch(saveUserProfile(user));
    }

    const changeHandler = (field: keyof EditableUserProfile) => (ev: ChangeEvent<HTMLInputElement>) => {
        if (!user) {
            return;
        }
        setUser({...user, [field]: ev.target.value, changed: true});
    }

    const refreshHandler = () => {
        dispatch(loadProfile());
    }
    const logoutHandler = () => {
        dispatch(logout());
    }

    return (
        <Grid2 container spacing={3}>
            <Grid2 xs={3} sm={2} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Avatar alt={user?.name} src={imageUrl ?? defaultProfilePic} sx={{width: 80, height: 80}}
                        variant="rounded"/>
            </Grid2>
            <Grid2 xs={9} sm={10}>
                <form onSubmit={submitHandler}>
                    <Typography variant="h3" component="h3" sx={{mb: 5}}>Login Profile</Typography>
                    {loading && <LinearProgress variant="indeterminate" sx={{mb: 1}}/>}
                    <Stack spacing={2} direction={{xs: "column", lg: "row"}}>
                        <TextField label="Name" type="text" fullWidth variant="filled" size="small"
                                   value={user?.name ?? ''} onChange={changeHandler('name')}/>
                        <TextField label="Email Address" type="email" fullWidth variant="filled" size="small"
                                   inputProps={{readOnly: true}}
                                   value={user?.email ?? ''} onChange={changeHandler('email')}/>
                        {user?.changed && (<Alert severity="warning">Don't forget to save your changes.</Alert>)}
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{mt: 5}} useFlexGap justifyContent="flex-end">
                        <Button type="button" variant="text" onClick={logoutHandler} color="error">Logout</Button>
                        <Button type="button" variant="text" onClick={refreshHandler}>Refresh</Button>
                        <Button type="button" variant="text" disabled={authType !== AUTH_LOCAL}
                                onClick={() => setShowModal(!showModal)}>
                            Change Password
                        </Button>
                        <Button type="submit" variant="outlined">Save Changes</Button>
                    </Stack>
                </form>
            </Grid2>
        </Grid2>
    );
}

export default UserProfile;
