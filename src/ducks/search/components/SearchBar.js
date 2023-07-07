import React, {useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/configureStore";
import {selectSearchLoading, selectSearchResults, selectSearchTerm} from "../index";
import {Autocomplete, TextField} from "@mui/material";
import {buildPath} from "../../../utils/path-utils";
import {CONTENT_PATH_SEARCH_IMAGE, PATH_CATEGORY, PATH_PAGE, PATH_PRODUCT} from "../../../constants/paths";
import {getSearchResults} from "../../../actions/app";
import {Link, useHistory} from 'react-router-dom';


const itemLink = ({parent, keyword, pagetype}) => {
    switch (pagetype) {
        case 'category':
            return buildPath(PATH_CATEGORY, {category: keyword});
        case 'page':
            return buildPath(PATH_PAGE, {keyword});
        case 'product':
            return buildPath(PATH_PRODUCT, {category: parent, product: keyword})
        default:
            return !!parent
                ? buildPath(PATH_PRODUCT, {category: parent, product: keyword})
                : buildPath(PATH_CATEGORY, {category: keyword});
    }
}


export default function SearchBar() {
    const dispatch = useAppDispatch();
    const term = useAppSelector(selectSearchTerm);
    const results = useAppSelector(selectSearchResults);
    const loading = useAppSelector(selectSearchLoading);
    const history = useHistory();

    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState(term ?? '');
    const [options, setOptions] = useState(results ?? []);

    const timer = useRef(0);

    useEffect(() => {
        return () => {
            window.clearTimeout(timer.current);
        }
    }, [])
    useEffect(() => {
        setInputValue(term ?? '');
        setOptions(results ?? []);
    }, [term, results]);

    useEffect(() => {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
            if (!inputValue || !inputValue.trim()) {
                return;
            }
            dispatch(getSearchResults(inputValue))
        }, 350);
    }, [inputValue]);


    const changeHandler = (ev, newValue) => {
        console.log('changeHandler', newValue);
        setValue(null);
        setInputValue('');
        window.clearTimeout(timer.current);
        if (newValue) {
            history.push(itemLink(newValue));
        }
    }

    return (
        <Autocomplete
            sx={{width: 300}}
            renderInput={(params) => (
                <TextField {...params} size="small" label="Search" fullWidth/>
            )}
            onInputChange={(ev, value) => setInputValue(value)}
            options={options}
            blurOnSelect
            getOptionLabel={(option) => option.title}
            filterOptions={(x) => x}
            onChange={changeHandler}
            renderOption={(props, option) => {
                const src = buildPath(CONTENT_PATH_SEARCH_IMAGE, {image: option.image || 'missing.png'});
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
