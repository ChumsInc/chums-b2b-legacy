import React from 'react';
import Select from '../common-components/Select';
import {longRepNo} from "../utils/customer";

const RepSelect = ({value='', reps = [], onSelect}) => {
    const options = reps
        .filter(rep => !!rep.active)
        .sort((a, b) => {
            const aa = longRepNo(a);
            const bb = longRepNo(b);
            return aa === bb ? 0 : (aa > bb ? 1 : -1 );
        })
        .map(rep => ({value: longRepNo(rep), text: `${longRepNo(rep)} - ${rep.SalespersonName}`}));
    return (
        <Select value={value} onChange={(value) => onSelect(value)} options={options} >
            <option>All Available Reps</option>
        </Select>
    )
};

export default RepSelect;
