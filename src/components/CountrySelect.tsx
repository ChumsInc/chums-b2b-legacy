/**
 * Created by steve on 9/6/2016.
 */

import React, {SelectHTMLAttributes} from 'react';
import {COUNTRIES} from '../constants/countries';
import {FieldValue} from "../types/generic";
import classNames from "classnames";


export interface CountrySelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    field: string;
    onChange: (arg: FieldValue) => void;
}

const CountrySelect = ({value = '', field = '', onChange, className, ...props}: CountrySelectProps) => (
    <select className={classNames("form-control form-control-sm", className)} value={value}
            {...props}
            onChange={(ev) => onChange({field: field ?? '', value: ev.target.value})}>
        <option value=''>Select One</option>
        {COUNTRIES.map(({cca3, name}) => <option key={cca3} value={cca3}>{name}</option>)}
    </select>
);

export default CountrySelect;
