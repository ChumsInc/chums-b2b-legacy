import React, {ChangeEvent, useId} from 'react';
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";

/*
@TODO: Add way to link to intranet store map to preview location.
@TODO: Will require rework of intranet store map before going live with feature.
 */

export interface StoreMapToggleProps {
    checked?: boolean;
    onChange: (ev:ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
}
const StoreMapToggle = ({checked, onChange, readOnly}:StoreMapToggleProps) => {
    return (
        <FormGroup>
            <FormControlLabel control={<Checkbox checked={checked ?? false} onChange={onChange} inputProps={{readOnly}} />}
                              label="Show on CHUMS.COM Store Map?" />
        </FormGroup>
    )
};

export default StoreMapToggle;
