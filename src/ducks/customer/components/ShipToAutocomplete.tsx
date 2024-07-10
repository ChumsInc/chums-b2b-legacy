import React, {useEffect, useState} from 'react'
import {ShipToAddress, ShipToCustomer} from "b2b-types";
import {useSelector} from "react-redux";
import {selectCustomerAccount, selectPermittedShipToAddresses} from "../selectors";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";


/**
 @TODO: This is not working correctly - maybe I'll finish it at a later date?
 @Author: Steve Montgomery, 2024.07.10
 @BUG: this will repeatedly send onChange if the current value is null (or '') and there is a default ship-to,
  not sure what logic to explore here - it may go deeper than I've got time for right now, so I'm reverting back
 to using ShipToSelect with a sorted list.
 */

export interface ShipToAutocompleteProps {
    shipToCode: string | null;
    label?: string;
    getOptionDisabled?: (option: ShipToCustomer) => boolean;
    onChange: (shipToCode: string | null, address: ShipToAddress | null) => void;
    readOnly?: boolean;
    required?: boolean;

}

const ShipToAutocomplete = ({
                                shipToCode,
                                label,
                                getOptionDisabled,
                                onChange,
                                readOnly,
                                required,
                            }: ShipToAutocompleteProps) => {
    const customer = useSelector(selectCustomerAccount);
    const shipToAddresses = useSelector(selectPermittedShipToAddresses);

    const [inputValue, setInputValue] = useState<string>(shipToCode ?? '');
    const [value, setValue] = useState<ShipToCustomer | null>(null);
    const [options, setOptions] = useState<ShipToCustomer[]>(shipToAddresses ?? []);

    useEffect(() => {
        console.debug('useEffect()[shipToCode, shipToAddresses]', {shipToCode})
        const [shipTo] = shipToAddresses.filter(shipTo => shipTo.ShipToCode === shipToCode);
        setValue(shipTo ?? null);
        setInputValue(shipTo?.ShipToCode ?? '');
    }, [shipToCode, shipToAddresses]);

    useEffect(() => {
        const options = shipToAddresses.filter(shipTo => {
            return shipTo.ShipToCode.toUpperCase().startsWith(inputValue.toUpperCase())
                || shipTo.ShipToName.toUpperCase().includes(inputValue.toUpperCase())
                || shipTo.ShipToCity?.toUpperCase().includes(inputValue.toUpperCase())
                || shipTo.ShipToState?.toUpperCase().includes(inputValue.toUpperCase())
                || shipTo.ShipToZipCode?.toUpperCase().includes(inputValue.toUpperCase())
        });
        setOptions(options)
    }, [inputValue, shipToAddresses]);

    useEffect(() => {
        if (!customer) {
            return onChange(value?.ShipToCode ?? null, null);
        }
        onChange(value?.ShipToCode ?? '', value);
    }, [value])

    const inputChangeHandler = (ev: React.SyntheticEvent, value: string) => {
        setInputValue(value);
    }

    const changeHandler = (ev: React.SyntheticEvent, newValue: ShipToCustomer | null) => {
        setValue(newValue);
    }

    if (!customer || !shipToAddresses.length) {
        return null;
    }

    return (
        <Autocomplete options={options}
                      size="small"
                      sx={{width: 300, display: 'inline-block'}}
                      renderInput={(params) => (
                          <TextField {...params} required={required} disabled={readOnly} variant="filled"
                                     size="small" label={label ?? 'Ship-To Location'}
                                     fullWidth/>
                      )}
                      inputValue={inputValue}
                      onInputChange={inputChangeHandler}
                      getOptionDisabled={getOptionDisabled}
                      isOptionEqualToValue={(option, value) => option.ShipToCode === value.ShipToCode}
                      noOptionsText="Billing Location"
                      blurOnSelect
                      getOptionLabel={(option) => `[${option.ShipToCode}] ${option.ShipToName}`}
                      filterOptions={(x) => x}
                      onChange={changeHandler}
                      renderOption={(props, option) => {
                          return (
                              <Stack direction="row" component="li" {...props} key={option.ShipToCode} spacing={2}>
                                  <Chip label={option.ShipToCode} size="small" sx={{width: '20%'}}/>
                                  <Box sx={{width: '80%'}}>
                                      <Typography variant="body1"
                                                  sx={{whiteSpace: 'wrap'}}>{option.ShipToName}</Typography>
                                      <Typography variant="body1"
                                                  sx={{fontSize: '80%'}}>{option.ShipToCity}, {option.ShipToState}</Typography>
                                  </Box>
                              </Stack>
                          )
                      }}
                      value={value}
        />
    )

}
export default ShipToAutocomplete;
