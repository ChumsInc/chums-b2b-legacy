import React, {ChangeEvent} from 'react';
import {BillToCustomer, ShipToCustomer} from "b2b-types";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

const TelephoneFormFields = ({account, readOnly, onChange}: {
    account: BillToCustomer | ShipToCustomer;
    onChange: (arg: Partial<BillToCustomer & ShipToCustomer>) => void;
    readOnly?: boolean;
}) => {
    const changeHandler = (field: keyof (BillToCustomer & ShipToCustomer)) => (ev: ChangeEvent<HTMLInputElement>) => {
        onChange({[field]: ev.target.value});
    }
    return (
        <Stack direction="row" spacing={2}>
            <TextField label="Telephone" variant="filled" fullWidth size="small" type="telephone"
                       onChange={changeHandler('TelephoneNo')}
                       value={account.TelephoneNo ?? ''} inputProps={{maxLength: 17, autoComplete: 'tel', readOnly}}/>
            <TextField label="Extension" variant="filled" fullWidth size="small" type="telephone"
                       onChange={changeHandler('TelephoneExt')}
                       value={account.TelephoneExt ?? ''} inputProps={{maxLength: 17, autoComplete: 'tel-extension', readOnly}}/>
        </Stack>
    )
}
export default TelephoneFormFields;
