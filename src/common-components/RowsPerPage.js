import React from 'react';
import Select from "./Select";
import FormGroup from "./FormGroup";

const RowsPerPage = ({value = 25, onChange}) => {
    return (
        <FormGroup label="Rows per Page" inline>
            <Select value={value} className="" field="rowsPerPage" onChange={({value}) => onChange(Number(value))}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
            </Select>
        </FormGroup>
    )
};

export default RowsPerPage;
