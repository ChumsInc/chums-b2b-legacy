/**
 * Created by steve on 9/6/2016.
 */

import React from 'react';
import {COUNTRIES} from '../constants/countries';

// export interface CountrySelectProps<T = any> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'>{
//     value: string;
//     field: keyof T|null,
//     onChange: (arg:TextInputChangeHandler<T>) => void
// }
const CountrySelect = ({value = '', field = null, onChange, ...props}) => (
    <select className="form-control form-control-sm" value={value}
            {...props}
            onChange={(ev) => onChange({field, value: ev.target.value})}>
        <option value=''>Select One</option>
        {COUNTRIES.map(({cca3, name}) => <option key={cca3} value={cca3}>{name}</option>)}
    </select>
);

export default CountrySelect;
