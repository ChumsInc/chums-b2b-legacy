import {useAppDispatch, useAppSelector} from "../../../app/configureStore";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import React, {ChangeEvent} from "react";
import {setInvoicesFilterSearch, setInvoicesFilterShipToCode, setShowPaidInvoices} from "../actions";
import {selectInvoicesSearch, selectInvoicesShipToFilter, selectInvoicesShowPaid} from "../selectors";
import ShipToSelect from "../../customer/components/ShipToSelect";
import FormGroup from "@mui/material/FormGroup";
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'

const InvoiceListFilter = ({onReload}: { onReload: () => void }) => {
    const dispatch = useAppDispatch();
    const search = useAppSelector(selectInvoicesSearch);
    const shipTo = useAppSelector(selectInvoicesShipToFilter);
    const showPaid = useAppSelector(selectInvoicesShowPaid);

    const searchChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setInvoicesFilterSearch(ev.target.value));
    }

    const shipToChangeHandler = (shipToCode: string | null) => {
        dispatch(setInvoicesFilterShipToCode(shipToCode))
    }

    const prepaidChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setShowPaidInvoices(ev.target.checked))
    }

    return (
        <Stack direction="row" spacing={2}>
            <TextField type="search" value={search} onChange={searchChangeHandler} variant="filled" size="small"
                       label="Search"
                       inputProps={{maxLength: 30}}
                       InputProps={{
                           startAdornment: (
                               <InputAdornment position="start"><SearchIcon/></InputAdornment>
                           )
                       }}
                       placeholder={'Invoice or PO #'}/>
            <ShipToSelect value={shipTo} onChange={shipToChangeHandler} allowAllLocations fullWidth={false}/>
            <FormGroup>
                <FormControlLabel control={<Checkbox checked={showPaid} onChange={prepaidChangeHandler}/>}
                                  label="Show paid invoices?"/>
            </FormGroup>
            <Button type="button" variant="text" onClick={onReload}>
                Reload
            </Button>
        </Stack>
    )
}

export default InvoiceListFilter;
