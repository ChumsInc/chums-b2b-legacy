import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {
    ItemSearchResult,
    loadItemLookup,
    selectSearchFulfilled,
    selectSearchLoading,
    selectSearchResults
} from "./index";
import {CONTENT_PATH_SEARCH_IMAGE} from "../../constants/paths";
import {useDebounceValue} from 'usehooks-ts'
import Stack from "@mui/material/Stack";
import {addToCart} from "../cart/actions";
import AddToCartButton from "../cart/components/AddToCartButton";
import {selectSalesOrderActionStatus} from "../open-orders/selectors";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";


export default function ItemAutocomplete({salesOrderNo}: {
    salesOrderNo: string;
}) {
    const dispatch = useAppDispatch();
    const results = useAppSelector(selectSearchResults);
    const loading = useAppSelector(selectSearchLoading);
    const fulfilled = useAppSelector(selectSearchFulfilled);
    const actionStatus = useAppSelector((state) => selectSalesOrderActionStatus(state, salesOrderNo));

    const [quantity, setQuantity] = useState(1);
    const [value, setValue] = useState<ItemSearchResult | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useDebounceValue<string>(inputValue, 500);

    const [options, setOptions] = useState(results ?? []);

    useEffect(() => {
        setOptions(results ?? []);
    }, [results]);

    useEffect(() => {
        setSearchTerm(inputValue);
    }, [inputValue]);

    useEffect(() => {
        dispatch(loadItemLookup(searchTerm));
    }, [searchTerm]);

    const changeHandler = (ev: React.SyntheticEvent, newValue: ItemSearchResult | null) => {
        setValue(newValue);
    }

    const inputChangeHandler = (ev: SyntheticEvent, value: string) => {
        setInputValue(value);
    }

    const quantityChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        const qty = +ev.target.value;
        setQuantity(Math.max(qty, 1));
    }

    const addToCartHandler = async () => {
        if (!value) {
            return;
        }
        if (global?.window?.gtag) {
            global.window.gtag('event', 'add_to_cart', {
                items: [{item_id: value.ItemCode, item_name: value.ItemCodeDesc ?? value.ItemCode, quantity: quantity}]
            })
        }
        await dispatch(addToCart({
            salesOrderNo: salesOrderNo,
            itemCode: value.ItemCode,
            quantity: quantity,
        }));
    }

    return (
        <Stack direction="row" spacing={1}>
            <Autocomplete
                size="small"
                sx={{width: 300, display: 'inline-block'}}
                renderInput={(params) => (
                    <TextField {...params} variant="filled" size="small" label="Search Items" fullWidth
                               InputProps={{
                                   ...params.InputProps,
                                   endAdornment: (
                                       <>
                                           {loading && (<CircularProgress color="inherit" size={20}/>)}
                                           {params.InputProps.endAdornment}
                                       </>
                                   )
                               }}
                    />
                )}
                inputValue={inputValue}
                onInputChange={inputChangeHandler}
                isOptionEqualToValue={(option, value) => option.ItemCode === value.ItemCode}
                options={options}
                noOptionsText={fulfilled ? 'Item Not Found' : null}
                blurOnSelect
                getOptionLabel={(option) => option.ItemCode}
                filterOptions={(x) => x}
                onChange={changeHandler}
                renderOption={(props, option) => {
                    const src = CONTENT_PATH_SEARCH_IMAGE
                        .replace(':image', encodeURIComponent(option.filename ?? 'missing.png'));
                    return (
                        <li {...props} key={option.ItemCode}>
                            <div className="search-result row g-3">
                                <div className="col-auto">
                                    {!!option.filename && <img src={src} alt={option.ItemCodeDesc ?? option.ItemCode}
                                                               className="img-fluid"/>}
                                </div>
                                <div className="col">
                                    <div>{option.ItemCode}</div>
                                    {!!option.ItemCodeDesc &&
                                        <div className="text-muted small">{option.ItemCodeDesc}</div>}
                                </div>
                                <div className="col-auto">{option.SalesUnitOfMeasure ?? 'EA'}</div>
                            </div>
                        </li>
                    )
                }}
                value={value}/>
            <TextField size="small" variant="filled"
                       inputProps={{inputMode: 'numeric', pattern: '[0-9]*', maxLength: 4}} label="Quantity" value={quantity}
                       onChange={quantityChangeHandler}
                       InputProps={{
                           endAdornment: (
                               <InputAdornment position="end">
                                   {value?.SalesUnitOfMeasure ?? 'EA'}
                               </InputAdornment>
                           )
                       }}
            />
            <AddToCartButton disabled={!quantity || !value || actionStatus !== 'idle'}
                             type="button" size="small" color="primary" fullWidth={false}
                             onClick={addToCartHandler}/>
            <div/>
        </Stack>
    )
}
