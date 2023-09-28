import React, {SyntheticEvent, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/configureStore";
import {getSearchResults, selectSearchLoading, selectSearchResults} from "../index";
import {Autocomplete, TextField} from "@mui/material";
import {
    CONTENT_PATH_SEARCH_IMAGE,
    PATH_CATEGORY,
    PATH_PAGE,
    PATH_PRODUCT,
    PATH_PRODUCT_WITHOUT_PARENT
} from "../../../constants/paths";
import {generatePath, Link} from 'react-router-dom';
import {SearchResult} from "b2b-types";
import {useDebounce} from 'usehooks-ts'
import {useNavigate} from "react-router";


const itemLink = (result: SearchResult) => {
    switch (result.pagetype) {
        case 'category':
            return generatePath(PATH_CATEGORY, {category: result.keyword});
        case 'page':
            return generatePath(PATH_PAGE, {keyword: result.keyword});
        default:
            if (result.parent) {
                return generatePath(PATH_PRODUCT, {category: result.parent, product: result.keyword})
            }
            return generatePath(PATH_PRODUCT_WITHOUT_PARENT, {product: result.keyword})
    }
}


export default function SearchBar() {
    const dispatch = useAppDispatch();
    const results = useAppSelector(selectSearchResults);
    const loading = useAppSelector(selectSearchLoading);
    const navigate = useNavigate();

    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const searchTerm = useDebounce<string>(inputValue, 500);

    const [options, setOptions] = useState(results ?? []);

    useEffect(() => {
        setOptions(results ?? []);
    }, [results]);

    useEffect(() => {
        dispatch(getSearchResults(searchTerm));
    }, [searchTerm]);

    const changeHandler = (ev: React.SyntheticEvent, newValue: SearchResult | null) => {
        console.log('changeHandler', newValue);
        setValue(null);
        setInputValue('');
        if (newValue) {
            const path = itemLink(newValue);
            navigate(path);
        }
    }

    const inputChangeHandler = (ev: SyntheticEvent, value: string) => {
        setInputValue(value);
    }

    return (
        <Autocomplete
            sx={{width: 300, display: 'inline-block'}}
            renderInput={(params) => (
                <TextField {...params} variant="outlined" size="small" label="Search" fullWidth/>
            )}
            inputValue={inputValue}
            onInputChange={inputChangeHandler}
            options={options}
            noOptionsText={null}
            blurOnSelect
            getOptionLabel={(option) => option.title}
            filterOptions={(x) => x}
            onChange={changeHandler}
            renderOption={(props, option) => {
                const src = CONTENT_PATH_SEARCH_IMAGE
                    .replace(':image', encodeURIComponent(option.image ?? 'missing.png'));
                const link = itemLink(option);
                return (
                    <li {...props} key={option.keyword}>
                        <Link to={link} className="search-result row g-3">
                            <div className="col-auto">
                                {!!option.image && <img src={src} alt={option.keyword} className="img-fluid"/>}
                            </div>
                            <div className="col">
                                <div>{option.title}</div>
                                {!!option.additional_data?.subtitle &&
                                    <div className="text-muted small">{option.additional_data.subtitle}</div>}
                                {option.pagetype !== 'product' && (<small>{option.pagetype}</small>)}
                            </div>
                        </Link>
                    </li>
                )
            }}
            value={value}/>
    )
}
