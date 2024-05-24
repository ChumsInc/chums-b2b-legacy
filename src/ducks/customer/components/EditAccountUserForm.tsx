import React, {ChangeEvent, FormEvent, useEffect, useId, useRef, useState} from 'react';
import Alert from "@mui/material/Alert";
import {useSelector} from "react-redux";
import {selectCustomerUsers} from "../selectors";
import {CustomerUser, Editable} from "b2b-types";
import {Button, DialogActions, DialogContent, DialogContentText, InputAdornment} from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PersonIcon from '@mui/icons-material/Person';
import NotesIcon from '@mui/icons-material/Notes';
import ShipToSelect from "./ShipToSelect";
import {generatePath, useMatch, useNavigate} from "react-router";
import {customerUserPath} from "../../../utils/path-utils";
import {removeUser, saveUser} from "../actions";
import {useAppDispatch} from "../../../app/configureStore";
import {selectIsEmployee, selectIsRep} from "../../user/selectors";
import Dialog from "@mui/material/Dialog";

const newUser: CustomerUser = {id: 0, name: '', email: '', accountType: 4};

const EditAccountUserForm = () => {
    const dispatch = useAppDispatch();
    const users = useSelector(selectCustomerUsers);
    const isEmployee = useSelector(selectIsEmployee);
    const isRep = useSelector(selectIsRep);

    const match = useMatch(customerUserPath);
    const navigate = useNavigate();
    const [user, setUser] = useState<(CustomerUser & Editable) | null>(null);
    const [canEdit, setCanEdit] = useState(false);
    const [addShipTo, setAddShipTo] = useState(false);
    const [disabledShipTo, setDisabledShipTo] = useState<string[]>([]);
    const [confirmation, setConfirmation] = useState<string|null>(null);
    const confirmHandler = useRef<(() => void)|null>();
    const dialogDescriptionId = useId();

    const dialogCancelHandler = () => {
        setConfirmation(null);
    }

    useEffect(() => {
        setAddShipTo(false);
        if (match?.params?.id === 'new') {
            setUser({...newUser});
            setDisabledShipTo([]);
            return;
        }
        const [user] = users.filter(u => u.id.toString() === match?.params?.id);
        if (!user) {
            setUser(null);
            setDisabledShipTo([]);
            return;
        }
        setUser({...user, shipToCode: []});
        setDisabledShipTo(user.shipToCode ?? []);
    }, [match?.params?.id, users]);

    useEffect(() => {
        setCanEdit((isEmployee || isRep) && (user?.accountType === 4 || !user))
    }, [isEmployee, isRep, user]);

    const changeHandler = (field: keyof CustomerUser) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!user) {
            return;
        }
        switch (field) {
            case 'name':
            case 'email':
            case 'notes':
                setUser({...user, [field]: ev.target.value, changed: true});
                return;
            default:
                return;
        }
    }

    const onSetShipToLocation = (shipToCode: string|null) => {
        if (!user) {
            return;
        }
        setUser({...user, shipToCode: [shipToCode ?? ''], changed: true});
    }

    const submitHandler = async (ev: FormEvent) => {
        ev.preventDefault();
        if (!user) {
            return;
        }
        await dispatch(saveUser(user));
        setUser(null);
        if (match?.params?.customerSlug) {
            navigate(generatePath(customerUserPath, {customerSlug: match?.params?.customerSlug, id: ''}))
        }
    }


    const newUserHandler = () => {
        setConfirmation(null);
        if (!match?.params?.customerSlug) {
            return;
        }
        navigate(generatePath(customerUserPath, {customerSlug: match.params.customerSlug, id: 'new'}));
    }

    const onNewUser = () => {
        if (user?.changed) {
            confirmHandler.current = newUserHandler;
            setConfirmation('Do you want to cancel your changes?');
            return;
        }
        newUserHandler();
    }

    const cancelHandler = () => {
        setConfirmation(null);
        setUser(null);
        if (!match?.params?.customerSlug) {
            return;
        }
        navigate(generatePath(customerUserPath, {customerSlug: match.params.customerSlug!, id: ''}));
    }

    const onCancel = () => {
        if (user?.changed) {
            confirmHandler.current = cancelHandler;
            setConfirmation('Do you want to cancel your changes?');
            return;
        }
        cancelHandler();
    }

    const deleteHandler = async () => {
        if (!user) {
            return;
        }
        setConfirmation(null);
        await dispatch(removeUser(user));
        setUser(null);
        if (!match?.params?.customerSlug) {
            return;
        }
        navigate(generatePath(customerUserPath, {customerSlug: match.params.customerSlug, id: ''}));
    }

    const onDeleteUser = async () => {
        if (!user) {
            return;
        }
        confirmHandler.current = deleteHandler;
        setConfirmation(`Are you sure you want to remove ${user?.email}?`);
    }

    if (!user) {
        return (
            <Button variant="outlined" type="button"
                    disabled={!(isEmployee || isRep)}
                    onClick={newUserHandler}>
                New User
            </Button>
        )
    }

    return (
        <form onSubmit={submitHandler}>
            <Stack direction="column" spacing={2}>
                <Typography variant="h3" component="h3">
                    {user.id === 0 && (<span>New User</span>)}
                    {user.id !== 0 && (<span>Update User</span>)}
                </Typography>
                {user.id === 0 && (
                    <Alert severity="info">
                        An email will be sent to welcome the new user with links to set a password.
                    </Alert>
                )}
                <TextField type="string" fullWidth label="User Name"
                           value={user.name} onChange={changeHandler('name')}
                           variant="filled"
                           InputProps={{
                               startAdornment: (<InputAdornment position="start"><PersonIcon/></InputAdornment>)
                           }}
                           disabled={user.accountType !== 4} required
                           helperText="Please enter the users full name"/>

                <TextField type="email" fullWidth label="Email Address"
                           value={user.email} onChange={changeHandler('email')}
                           variant="filled"
                           InputProps={{
                               startAdornment: (<InputAdornment position="start"><AlternateEmailIcon/></InputAdornment>)
                           }}
                           disabled={user.accountType !== 4} required/>
                {(user.id === 0 || addShipTo) && (
                    <ShipToSelect label="Access Permissions" disabledShipToLocations={disabledShipTo}
                                  value={user.shipToCode?.[0] ?? null} onChange={onSetShipToLocation}/>
                )}
                {user.id === 0 && (
                    <TextField multiline fullWidth label="Welcome Message"
                               value={user.notes} onChange={changeHandler('notes')}
                               variant="filled"
                               InputProps={{
                                   startAdornment: (<InputAdornment position="start"><NotesIcon/></InputAdornment>)
                               }}
                               disabled={user.accountType !== 4} required
                               helperText="Please enter a welcome message to the new user."/>
                )}
                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" disabled={!canEdit}>
                        Save
                    </Button>
                    <Button type="button" variant="text" className="btn btn-sm btn-outline-secondary"
                            onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="text" type="button"
                            disabled={!(isEmployee || isRep) || user?.id === 0}
                            onClick={onNewUser}>
                        New User
                    </Button>
                    {!!user.id && user.accountType === 4 &&(
                        <Button variant="text" type="button"
                                disabled={!(isEmployee || isRep) || user?.id === 0 || user.billTo}
                                onClick={() => setAddShipTo(true)}>
                            New Ship-To Location
                        </Button>
                    )}
                    {user.id !== 0 && (
                        <Button type="button" variant="text" color="error"
                                disabled={!canEdit} onClick={onDeleteUser}>
                            Delete
                        </Button>
                    )}
                </Stack>
            </Stack>
            <Dialog open={!!confirmation} onClose={dialogCancelHandler} aria-describedby={dialogDescriptionId}>
                <DialogContent>
                    <DialogContentText id={dialogDescriptionId}>{confirmation}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={dialogCancelHandler}>Cancel</Button>
                    <Button onClick={confirmHandler.current ?? dialogCancelHandler}>Agree</Button>
                </DialogActions>
            </Dialog>
        </form>
    )
}

export default EditAccountUserForm;
