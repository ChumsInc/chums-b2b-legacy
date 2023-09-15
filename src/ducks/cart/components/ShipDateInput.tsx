import React, {ChangeEvent, useEffect, useId, useState} from "react";
import {minShipDate} from "@/utils/orders";
import {DateCalendar,} from "@mui/x-date-pickers/DateCalendar";
import dayjs, {Dayjs} from "dayjs";
import {FormControl, InputAdornment, InputBaseComponentProps, InputLabel, Popover} from "@mui/material";
import FilledInput from "@mui/material/FilledInput";
import IconButton from "@mui/material/IconButton";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {FormControlProps} from "@mui/material/FormControl";

export interface ShipDateInputProps extends Omit<FormControlProps, 'onChange'> {
    value: string | null;
    readOnly?: boolean;
    disabled?: boolean;
    onChange: (value: string | null) => void;
    inputProps: InputBaseComponentProps;
}

export default React.forwardRef(function ShipDateInput({value, onChange, inputProps, readOnly, disabled, ...formControlProps}: ShipDateInputProps, ref: React.Ref<HTMLInputElement>) {
    const [min, setMin] = useState<string>(minShipDate())
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const id = useId();
    const popoverId = useId();

    useEffect(() => {
        setMin(minShipDate());
    }, []);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        const value = ev.target.value;
        if (!dayjs(value).isValid() || dayjs(value).isBefore(min)) {
            return onChange(dayjs(min).toISOString())
        }
        onChange(dayjs(value).toISOString());
    }

    const dateValue = (value: string | null): string => {
        if (!dayjs(value).isValid() || dayjs(value).isBefore(min)) {
            return dayjs(min).format('YYYY-MM-DD');
        }
        const offset = dayjs(value).toDate().getTimezoneOffset();
        return dayjs(value).add(offset, 'minutes').format('YYYY-MM-DD');
    }

    const buttonClickHandler = (ev: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(ev.currentTarget);
    }

    const calendarChangeHandler = (value: Dayjs | null) => {
        setAnchorEl(null);
        if (!dayjs(value).isValid() || dayjs(value).isBefore(min)) {
            return onChange(dayjs(min).toISOString())
        }
        onChange(dayjs(value).toISOString());
    }

    return (
        <FormControl variant="filled" fullWidth size="small" {...formControlProps}>
            <InputLabel htmlFor={id}>Requested Ship Date</InputLabel>
            <FilledInput type="date" value={dateValue(value)} inputRef={ref}
                         onChange={changeHandler}
                         inputProps={{
                             readOnly, id, ref,
                             min: dayjs(min).format('YYYY-MM-DD'),
                             max: dayjs(min).add(1, 'year').format('YYYY-MM-DD'),
                             ...inputProps}}
                         startAdornment={
                             <InputAdornment position="start">
                                 <IconButton aria-label="Show available ship dates"
                                             onClick={buttonClickHandler}>
                                     <CalendarMonthIcon/>
                                 </IconButton>
                             </InputAdornment>
                         }/>
            <Popover id={popoverId} open={!!anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
                <DateCalendar value={dayjs(dateValue(value))} onChange={calendarChangeHandler} minDate={dayjs(min)}/>
            </Popover>
        </FormControl>
    )
})
