import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {loadProfile, logout, saveUserProfile} from "../actions";
import {AUTH_GOOGLE, AUTH_LOCAL} from "../../../constants/app";
import {useAppDispatch} from "../../../app/configureStore";
import {selectAuthType, selectProfilePicture, selectUserLoading, selectUserProfile} from "../selectors";
import {Editable} from "b2b-types";
import {ExtendedUserProfile} from "../../../types/user";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {Button, InputAdornment, TextField} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import {Link as NavLink} from 'react-router-dom';
import Container from "@mui/material/Container";
import LockPersonIcon from '@mui/icons-material/LockPerson';

type EditableUserProfile = Pick<ExtendedUserProfile, 'name' | 'email'> & Editable;

const defaultProfilePic = (email: string) => email.endsWith('@chums.com') ? '/images/chums/Chums_Logo_Booby.png' : null;

const UserProfile = () => {
    const dispatch = useAppDispatch();
    const imageUrl = useSelector(selectProfilePicture);
    const profile = useSelector(selectUserProfile);
    const authType = useSelector(selectAuthType);
    const loading = useSelector(selectUserLoading);

    const [user, setUser] = useState<EditableUserProfile | null>(profile);
    const [profilePic, setProfilePic] = useState<string | null>(imageUrl);

    useEffect(() => {
        if (!profile) {
            setUser(null);
            setProfilePic(null);
            return;
        }
        const {name, email} = profile;
        setUser({name, email})
        setProfilePic(imageUrl ?? defaultProfilePic(email));
    }, [profile, imageUrl]);

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

    const renderEmailLockIcon = () => {
        return authType === AUTH_GOOGLE
            ? (<InputAdornment position="end" title="Logged in with Google" sx={{cursor: 'not-allowed'}}><LockPersonIcon /></InputAdornment>)
            : null;
    }

    return (
        <Container maxWidth="xl">
            <Typography variant="h1" component="h1" sx={{mb: 5}}>Login Profile</Typography>
            <Grid2 container spacing={3} alignItems="start">
                <Grid2 xs={3} sm={2} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Avatar alt={user?.name} src={profilePic ?? undefined} sx={{width: 80, height: 80}}
                            slotProps={{img: {referrerPolicy: 'no-referrer'}}}
                            variant="rounded"/>
                </Grid2>
                <Grid2 xs={9} sm={10}>
                    <form onSubmit={submitHandler}>
                        {loading && <LinearProgress variant="indeterminate" sx={{mb: 1}}/>}
                        <Stack spacing={2} direction={{xs: "column", lg: "row"}}>
                            <TextField label="Name" type="text" fullWidth variant="filled" size="small"
                                       value={user?.name ?? ''} onChange={changeHandler('name')}/>
                            <TextField label="Email Address" type="email" fullWidth variant="filled" size="small"
                                       inputProps={{readOnly: authType !== AUTH_LOCAL}}
                                       InputProps={{endAdornment: renderEmailLockIcon() }}
                                       helperText={authType === AUTH_GOOGLE ? 'Please contact CHUMS customer service if you need to change your email address' : undefined}
                                       value={user?.email ?? ''} onChange={changeHandler('email')}/>
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{mt: 5}} useFlexGap justifyContent="flex-end">
                            <Button type="button" variant="text" onClick={logoutHandler} color="error">Logout</Button>
                            <Button type="button" variant="text" onClick={refreshHandler}>Refresh</Button>
                            <Button type="button" variant="text" disabled={authType !== AUTH_LOCAL}
                                    component={NavLink} to="/profile/set-password">
                                Change Password
                            </Button>
                            <Button type="submit" variant="contained" disabled={!user?.changed}>Save Changes</Button>
                        </Stack>
                        {user?.changed && (<Alert severity="warning">Don't forget to save your changes.</Alert>)}
                    </form>
                </Grid2>
            </Grid2>
        </Container>
    );
}

export default UserProfile;
